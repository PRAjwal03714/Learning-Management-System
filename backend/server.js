require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

const app = express();
require('./src/middlewares/authOAuth');

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

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ✅ Serve static uploaded files
app.use('/uploads/assignments', express.static(path.join(__dirname, 'uploads/assignments')));
app.use('/uploads/instructor-files', express.static(path.join(__dirname, 'uploads/instructor-files')));
app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile'))); // 🔥 THIS FIXES YOUR IMAGE DISPLAY

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/profile', profileRoutes);

// Server Start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
