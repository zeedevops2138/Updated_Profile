# Updated Profile App

A full-stack profile management application built with:

- **Node.js + Express**
- **MongoDB + Mongo Express (via Docker)**
- **Amazon S3** for profile image storage
- **Bootstrap UI** for responsive frontend

This app allows users to:
- Enter their email to load an existing profile (if any)
- Upload a profile picture
- Fill out profile details (name, DOB, bio, etc.)
- Persist everything in **MongoDB**
- Store uploaded images securely in **Amazon S3**

---

## 🌐 Live Tech Stack

- **Frontend**: HTML + Bootstrap + Vanilla JS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Dockerized)
- **File Storage**: AWS S3
- **Mongo Dashboard**: Mongo Express (via Docker)

---

## 🔐 Environment Setup (`.env` file)

You must create a `.env` file in the root of the project with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb://admin:password@mongodb:27017
MONGODB_DB_NAME=profileAppDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password

# AWS S3 Config
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region (e.g., us-east-1)
AWS_BUCKET_NAME=your-bucket-name

# App
APP_PORT=3000


🚀 Run the App Locally (via Docker)
Prerequisites:

Docker Compose

1. Clone the Repository
git clone https://github.com/your-username/techworld-js-docker-demo-app.git

cd techworld-js-docker-demo-app

2. Create .env file

As explained above.

3. Build & Run with Docker Compose
   docker compose up --build

4. Access the App

Frontend: http://localhost:3000

Mongo Express: http://localhost:8081

🪣 How to Create and Configure AWS S3 Bucket

Login to AWS Console → Go to S3

Create a new bucket (e.g., users-updated-photos-bucket)

Disable "Block all public access"

Set Bucket Policy like below:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::users-updated-photos-bucket/*"
    }
  ]
}


Make sure:

Your AWS IAM user has PutObject permission

You use correct AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env

📁 Project Structure
├── server.js              # Express backend
├── index.html             # Main frontend
├── style.css              # UI styling
├── images/                # Default profile picture
├── .env                   # Environment config
├── docker-compose.yml     # All services
├── Dockerfile             # For the app container
└── README.md              # You're reading this

✅ Features

🔍 Load user by email

🖼️ Upload profile photo to S3

🧾 Save full user data in MongoDB

📊 View and verify via Mongo Express

🌐 Clean Bootstrap UI

💾 Persistent DB storage via volumes