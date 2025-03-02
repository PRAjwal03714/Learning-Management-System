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
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_SERVICE=gmail

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

---

## 🔜 Next Steps
- **Implement Duo Authentication for Additional Security**
  - Require Duo MFA after login.
  - Users must approve login via **Duo Push, SMS, or phone call**.
  - Secure accounts from unauthorized access.
- **Store Password Reset Tokens in Database**
- **Enhance API Security with Rate Limiting & Logging**

