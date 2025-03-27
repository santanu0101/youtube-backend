# YouTube Backend API (Node.js)

A **YouTube-like backend API** built using **Node.js** and **Express.js**, featuring secure authentication, video uploads, and database management with **MongoDB**.

## Features 🚀

### **1️⃣ User Authentication & Security**
- Secure **password hashing** using `bcrypt`.
- Authentication and **JWT-based token management** with `jsonwebtoken`.
- Secure **cookie-based authentication** using `cookie-parser`.

### **2️⃣ Video Upload & Storage**
- **Multer** for handling video file uploads.
- **Cloudinary** for cloud-based media storage and management.

### **3️⃣ Database & Pagination**
- **MongoDB** and **Mongoose** for efficient data storage.
- **Mongoose Aggregate Pagination** for handling large datasets efficiently.

### **4️⃣ API Features**
- **CORS-enabled** for secure cross-origin requests.
- **Environment variables** managed via `dotenv`.
- **RESTful API design** with Express.js.

---
## Installation & Setup ⚙️

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/youtube_backend.git
cd youtube_backend
```

### **2️⃣ Install Dependencies**
```sh
npm install  # Install backend dependencies
```

### **3️⃣ Setup Environment Variables**
Create a `.env` file in the root directory and configure the following:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **4️⃣ Start the Server**
```sh
npm start  # Start the backend server
```
> The API will run on `http://localhost:5000`

---
## API Endpoints 📌

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/auth/register` | User registration |
| **POST** | `/api/auth/login` | User login & JWT generation |
| **POST** | `/api/videos/upload` | Upload a video |
| **GET** | `/api/videos` | Get all videos with pagination |
| **GET** | `/api/videos/:id` | Get a single video by ID |
| **DELETE** | `/api/videos/:id` | Delete a video |

---
## Project Dependencies 📦

| Package | Description |
|---------|-------------|
| `bcrypt` | Secure password hashing |
| `cloudinary` | Cloud-based media storage |
| `cookie-parser` | Parses cookies for authentication |
| `cors` | Enables secure cross-origin resource sharing |
| `dotenv` | Manages environment variables |
| `express` | Fast, minimalist web framework |
| `jsonwebtoken` | Handles JWT authentication |
| `mongoose` | MongoDB ODM for schema modeling |
| `mongoose-aggregate-paginate-v2` | Efficient pagination for MongoDB queries |
| `multer` | Middleware for handling file uploads |

---
## Contributing 💡
Contributions are welcome! Feel free to fork the repository, make improvements, and submit a pull request.

<!-- ---
## License 📜
This project is licensed under the **MIT License**. -->

---
## Contact 📬
For any queries, reach out at **[Your Email or GitHub](https://github.com/yourusername)**.

Happy Coding! 🚀🎥

