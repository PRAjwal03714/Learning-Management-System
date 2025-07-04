require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
require('./src/middlewares/authOAuth'); 



// Create HTTP server and bind to app
const server = http.createServer(app);

// Database & Routes
const pool = require('./src/config/db');
const adminRoutes = require('./src/routes/adminRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const announcementRoutes = require('./src/routes/announcementRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes');
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const studentProfileRoutes = require('./src/routes/studentProfileRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
 // ✅ if you have chat REST APIs

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'learning-management-system-studymate.vercel.app' 
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin like mobile apps or curl
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Static file serving
app.use('/uploads/assignments', express.static(path.join(__dirname, 'uploads/assignments')));
app.use('/uploads/instructor-files', express.static(path.join(__dirname, 'uploads/instructor-files')));
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.use('/uploads/student-submissions', express.static(path.join(__dirname, 'uploads/student-submissions')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/student/profile', studentProfileRoutes);
app.use('/api/chat', chatRoutes);
 // ✅ optional if you built chat history API

// Start the HTTP+Socket server (NOT just express)
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running with WebSocket on http://localhost:${PORT}`);
});
module.exports = app;
