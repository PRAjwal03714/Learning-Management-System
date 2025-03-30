# Learning Management System (LMS) Backend

This is the backend for the Learning Management System (LMS), built using **Node.js**, **Express.js**, and **JWT authentication**. The backend handles **user authentication, OAuth authentication, password reset, role-based access control (RBAC), and API endpoints**.

## 🚀 Features
- User Registration & Login (JWT Authentication)
- OAuth Authentication (Google & Facebook Login)
- Password Reset with Email Verification
- Role-Based Access Control (RBAC) (Student, Instructor, Admin)
- Middleware for Authentication & Security
- Temporary Data Storage in JSON File (Replaceable with PostgreSQL)
- Express API Endpoints for Authentication
- **Password Reset & Recovery** (Security Questions, Reset Link, OTP via Email/Text/Duo)
- **Instructor Course Management** (Create and View Courses)

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
```env
PORT=5001
JWT_SECRET=supersecretkey

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_SERVICE=gmail

# PostgreSQL
DATABASE_URL=postgresql://studymate:4wBnfzlazVmalsq0PbS7WCQhXiQzwEj1@dpg-cv2g5jdsvqrc738uo3f0-a.oregon-postgres.render.com/studymate_a9es

# Duo Security
DUO_CLIENT_ID=your-duo-client-id
DUO_CLIENT_SECRET=your-duo-client-secret
DUO_API_HOSTNAME=api-xxxxxxx.duosecurity.com
DUO_REDIRECT_URI=http://localhost:5001/api/auth/duo/callback
```

### 4️⃣ Run the Server
```sh
node server.js
```
✅ Server will start at `http://localhost:5000`

---
## 🗄️ PostgreSQL Integration

User data is now saved to PostgreSQL using the connection string:

```env
DATABASE_URL=postgresql://studymate:4wBnfzlazVmalsq0PbS7WCQhXiQzwEj1@dpg-cv2g5jdsvqrc738uo3f0-a.oregon-postgres.render.com/studymate_a9es
```

## 📁 Project Structure
```
backend-lms/
│── src/
│   ├── controllers/     # Business logic for routes
│   ├── middlewares/     # Authentication & error handling
│   ├── routes/          # Express API routes
│   ├── users.json       # Temporary user storage
│   ├── utils/           # Utility functions (Email service, OAuth, etc.)
│                        # Express app setup
│── server.js            # Server entry point
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
  "role": "student",
  "securityQuestion": "What is your favorite color?",
  "securityAnswer": "blue"
}
```
✅ **Response:**
```json
{
  "message": "User registered successfully",
  "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "student" }
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

#### 3️⃣ OAuth Authentication (Google & Facebook Login)
**Google Login:** `GET /api/auth/google`
**Facebook Login:** `GET /api/auth/facebook`

✅ **Response (After Login & Redirect):**
```json
{
  "message": "Google login successful",
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

#### 4️⃣ Password Reset
**Request Password Reset:** `POST /api/auth/request-password-reset`
```json
{
  "email": "john@example.com"
}
```
✅ **Response:**
```json
{
  "message": "Password reset link sent to email."
}
```

**Reset Password:** `POST /api/auth/reset-password/:token`
```json
{
  "email": "john@example.com",
  "newPassword": "newPass123"
}
```
✅ **Response:**
```json
{
  "message": "Password reset successful. You can now log in with your new password."
}
```

#### 5️⃣ OTP Authentication (For Password Reset & Extra Security)
**Send OTP:** `POST /api/auth/send-otp`
```json
{
  "email": "john@example.com"
}
```
✅ **Response:**
```json
{
  "message": "OTP sent to email. Check your inbox."
}
```

**Verify OTP:** `POST /api/auth/verify-otp`
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
✅ **Response:**
```json
{
  "message": "OTP verified. You can now reset your password."
}
```

#### 6️⃣ Access Protected Route
**GET** `/api/protected/dashboard`
- **Headers:** `{ Authorization: Bearer <TOKEN> }`
✅ **Response:**
```json
{
  "message": "Welcome student! This is your dashboard."
}
```

---

### **Password Reset & Recovery**

#### 4️⃣ Verify Security Question Before Password Reset
**POST** `/api/auth/verify-security-question`
```json
{
  "email": "john@example.com",
  "securityAnswer": "blue"
}
```
✅ **Response:**
```json
{
  "message": "Security answer verified. Use this token to reset your password.",
  "resetToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### 5️⃣ Reset Password Using Token
**POST** `/api/auth/reset-password`
```json
{
  "email": "john@example.com",
  "newPassword": "newpass123",
  "resetToken": "550e8400-e29b-41d4-a716-446655440000"
}
```
✅ **Response:**
```json
{
  "message": "Password reset successful. You can now log in with your new password."
}
```

#### 6️⃣ OTP-Based Password Reset
**POST** `/api/auth/send-otp`
```json
{
  "email": "john@example.com"
}
```
✅ **Response:**
```json
{
  "message": "OTP sent to email. Check your inbox."
}
```

**POST** `/api/auth/verify-otp`
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
✅ **Response:**
```json
{
  "message": "OTP verified. You can now reset your password."
}
```

## 🔒 Duo Authentication (2FA)

### 📥 Initiate Duo Authentication

**POST** `/api/auth/duo/auth`

```json
{
  "username": "john_doe"
}
```

✅ **Response:**

```json
{
  "authUrl": "https://api-xxxxx.duosecurity.com/oauth/v1/authorize?...&duo_code=..."
}
```

- This URL is opened by the frontend to prompt Duo login.
- On success, Duo redirects to:

```
/api/auth/duo/callback?duo_code=xxxx&state=xxxx
```

### 📤 Handle Duo Callback

**GET** `/api/auth/duo/callback?duo_code=...&state=...`

✅ **Success Response:**

```json
{
  "message": "Duo Authentication Successful",
  "token": "JWT with duoVerified: true"
}
```

---

## 📚 Instructor Course Management

### 🆕 Create a Course
**POST** `/api/courses/create-course`
- **Headers:** `{ Authorization: Bearer <INSTRUCTOR_JWT> }`
```json
{
  "department": "CS",
  "number": 565,
  "name": "Software Engineering II",
  "term": "Spring 2025",
  "start_date": "2025-03-01",
  "end_date": "2025-05-30",
  "credits": 3.0,
  "is_published": true,
  "is_active": true
}
```
✅ **Response:**
```json
{
  "message": "Course created successfully",
  "course": { "id": "uuid", "name": "Software Engineering II", ... }
}
```

### 📄 View Instructor’s Courses
**GET** `/api/courses/my-courses`
- **Headers:** `{ Authorization: Bearer <INSTRUCTOR_JWT> }`
✅ **Response:**
```json
{
  "message": "Courses fetched successfully",
  "courses": [ { "id": "uuid", "name": "Software Engineering II" }, ... ]
}
```

### 📢 Announcements Management

Instructors can post announcements for specific courses. Students (once enrolled logic is added) will be able to view announcements for their courses.

#### 🆕 Post an Announcement  
**POST** `/api/announcements/create`  
- **Headers:** `{ Authorization: Bearer <INSTRUCTOR_JWT> }`  
```json
{
  "course_id": "actual-course-uuid",
  "title": "Reminder: Midterm on Friday",
  "content": "The midterm will be held on Friday at 10AM in Room 301."
}
```

✅ **Response:**
```json
{
  "message": "Announcement posted successfully",
  "announcement": {
    "id": "uuid",
    "course_id": "uuid",
    "title": "Reminder: Midterm on Friday",
    "content": "The midterm will be held on Friday at 10AM in Room 301.",
    "instructor_id": "uuid"
  }
}
```

#### 📥 View Announcements for a Course  
**GET** `/api/announcements/:courseId`  
- **Headers:** `{ Authorization: Bearer <JWT> }`

✅ **Response:**
```json
[
  {
    "id": "uuid",
    "course_id": "uuid",
    "instructor_id": "uuid",
    "title": "Reminder: Midterm on Friday",
    "content": "The midterm will be held on Friday at 10AM in Room 301."
  },
  ...
]
```

---