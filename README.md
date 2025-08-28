# Updated Profile App

A full-stack profile management application built with:

- **Node.js + Express**
- **MongoDB + Mongo Express (via Docker)**
- **Amazon S3** for profile image storage
- **Bootstrap UI** for responsive frontend

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Usage](#usage)
- [AWS S3 Setup](#aws-s3-setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## ✅ Features

- 🔍 Load user profile by email
- 🖼️ Upload profile photo to S3
- 🧾 Save full user data in MongoDB
- 📊 View and verify data via Mongo Express
- 🌐 Responsive Bootstrap UI
- 💾 Persistent DB storage via Docker volumes

---

## 🌐 Tech Stack

- **Frontend:** HTML, Bootstrap, Vanilla JS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Dockerized)
- **File Storage:** AWS S3
- **Dashboard:** Mongo Express (via Docker)

---

## 🔐 Environment Setup (`.env` file)

Create a `.env` file in the root of the project with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb://admin:password@mongodb:27017/?authSource=admin
MONGODB_DB_NAME=my-db
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password

# AWS S3 Config
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name

# App
APP_PORT=3000
```

---

## 🚀 Installation & Running Locally (via Docker Compose)

**Prerequisites:**  
- Docker & Docker Compose installed

1. **Clone the Repository**  
    ```sh
    git clone https://github.com/zeedevops2138/Updated_Profile.git
    cd Updated_Profile
    ```

2. **Create `.env` file**  
   As described above.

3. **Build & Run with Docker Compose**  
    ```sh
    docker compose up --build
    ```

4. **Access the App**  
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Mongo Express: [http://localhost:8081](http://localhost:8081)

---

## 🪣 AWS S3 Bucket Setup

1. **Create Bucket**  
   - Login to AWS Console → Go to S3  
   - Create a new bucket (e.g., `users-updated-photos-bucket`)  
   - Disable "Block all public access"

2. **Set Bucket Policy**  
   ```json
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
   ```

3. **Permissions**  
   - Ensure your AWS IAM user has `PutObject` permission.  
   - Use correct `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `.env`.

---

## 📁 Project Structure

```
├── server.js              # Express backend
├── index.html             # Main frontend
├── style.css              # UI styling
├── images/                # Default profile picture
├── .env                   # Environment config
├── docker-compose.yml     # All services
├── Dockerfile             # For the app container
└── README.md              # You're reading this
```

---

## 🤝 Contributing

Contributions are welcome!  
Please open issues or submit pull requests for improvements and bug fixes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For questions or support, please open an issue or reach out to [@zeedevops2138](https://github.com/zeedevops2138).
