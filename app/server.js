require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();

// Env vars
const mongoUrl = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME;
const port = process.env.APP_PORT || 3000;
const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;

console.log('ENV VALUES');
console.log({ mongoUrl, databaseName, bucket, region });

// AWS S3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION
});


// File upload setup
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.static(path.join(__dirname))); // Static files

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve default profile picture
app.get('/profile-picture', (req, res) => {
  const imgPath = path.join(__dirname, 'images/profile-1.jpg');
  if (fs.existsSync(imgPath)) {
    const img = fs.readFileSync(imgPath);
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
  } else {
    res.status(404).send('Default image not found');
  }
});

// Profile update endpoint
app.post('/update-profile', upload.single('profileImage'), async (req, res) => {
  try {
    console.log('➡️ /update-profile request received');
    const userPayload = JSON.parse(req.body.user);
    const email = userPayload.email?.trim();

    if (!email) {
      console.warn('⚠️ Email is missing in payload');
      return res.status(400).json({ error: 'Email is required.' });
    }

    const updateData = { ...userPayload };

    if (req.file) {
      console.log('📸 Uploading profile image to S3...');
      const key = `profiles/${Date.now()}_${req.file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      try {
        await s3Client.send(command);
        console.log(`✅ Image uploaded: ${key}`);
        updateData.imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
      } catch (s3Error) {
        console.error('❌ S3 Upload Error:', s3Error);
        return res.status(500).json({ error: 'Failed to upload image to S3.' });
      }
    }

    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(databaseName);

    const result = await db.collection('users').updateOne(
      { email },
      { $set: updateData },
      { upsert: true }
    );
    console.log(`✅ MongoDB update result: ${JSON.stringify(result)}`);

    await client.close();

    res.json(updateData);
  } catch (err) {
    console.error('❌ Error in /update-profile:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Profile fetch endpoint
app.get('/get-profile', async (req, res) => {
  try {
    const email = req.query.email?.trim();

    if (!email) {
      console.warn('⚠️ No email provided to /get-profile');
      return res.status(400).json({ error: 'Email is required.' });
    }

    console.log(`🔍 Looking up profile for email: ${email}`);

    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(databaseName);
    const user = await db.collection('users').findOne({ email });
    await client.close();

    if (user) {
      res.json({ user });
    } else {
      res.json({ newUser: true });
    }
  } catch (err) {
    console.error('❌ Error in /get-profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err.stack || err);
  res.status(500).json({ error: 'Server Error' });
});

// Start the app
app.listen(port, () => {
  console.log(`🚀 App listening on port ${port}!`);
});
