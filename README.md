# Learning Management System (LMS) Backend

This is the backend for the Learning Management System (LMS), built using **Node.js**, **Express.js**, and **JWT authentication**. The backend handles **user authentication, role-based access control (RBAC), and API endpoints**.

## 🚀 Features
- User Registration & Login (JWT Authentication)
- Role-Based Access Control (RBAC) (Student, Instructor, Admin)
- Middleware for Authentication & Security
- Temporary Data Storage in JSON File (Replaceable with PostgreSQL)
- Express API Endpoints for Authentication

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/backend-lms.git
cd backend-lms
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root folder and add the following:
```
PORT=5000
JWT_SECRET=supersecretkey
```

### 4️⃣ Run the Server
```sh
node server.js
```
✅ Server will start at `http://localhost:5000`

---

## 📁 Project Structure
```
backend-lms/
│── src/
│   ├── controllers/     # Business logic for routes
│   ├── middlewares/     # Authentication & error handling
│   ├── routes/          # Express API routes
│   ├── users.json       # Temporary user storage
│   ├── app.js           # Express app setup
│   ├── server.js        # Server entry point
│── .env                 # Environment variables
│── package.json         # Dependencies
│── README.md            # Documentation
```

---

## 🔐 API Endpoints

### **User Authentication**

#### 1️⃣ Register a User
**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```
✅ **Response:**
```json
{
  "message": "User registered successfully",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "student" }
}
```

#### 2️⃣ Login
**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
✅ **Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

#### 3️⃣ Access Protected Route
**GET** `/api/protected/dashboard`
- **Headers:** `{ Authorization: Bearer <TOKEN> }`
✅ **Response:**
```json
{
  "message": "Welcome student! This is your dashboard."
}
```

---

## 📌 Next Steps
- ✅ Add PostgreSQL Database (Replace JSON storage)
- ✅ Implement OAuth (Google, Facebook Login)
- ✅ Add Forgot Password & OTP Verification

💬 Need help? Open an issue or contribute! 🚀

