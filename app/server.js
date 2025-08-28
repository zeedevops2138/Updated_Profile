require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();

// Environment variables
const mongoUrl = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME;
const port = process.env.APP_PORT || 3000;

// AWS S3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File upload setup
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files (CSS, images, etc.)

// Serve the homepage
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

// Endpoint to update profile
app.post('/update-profile', upload.single('profileImage'), async (req, res) => {
  try {
    const userPayload = JSON.parse(req.body.user);
    const email = userPayload.email?.trim();

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const updateData = { ...userPayload };

    if (req.file) {
      const key = `profiles/${Date.now()}_${req.file.originalname}`;
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,        
      }));
      updateData.imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(databaseName);

    await db.collection('users').updateOne(
      { email },
      { $set: updateData },
      { upsert: true }
    );

    await client.close();

    res.json(updateData);
  } catch (err) {
    console.error('Error in /update-profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get profile
app.get('/get-profile', async (req, res) => {
  try {
    const email = req.query.email?.trim();

    if (!email) {
      console.error('No email provided in /get-profile');
      return res.status(400).json({ error: 'Email is required.' });
    }

    console.log(`Looking up profile for email: ${email}`);

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
    console.error('Error in /get-profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err);
  res.status(500).json({ error: 'Something broke on the server.' });
});

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
