// const fs = require('fs');
// const multer = require('multer');
// const path = require('path');

// //
// // Helper to ensure folder exists
// //
// function ensureFolderExists(dir) {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// }

// //
// // 🔹 Assignment Upload Storage
// //
// const assignmentDir = path.join(__dirname, '../../uploads/assignments');
// ensureFolderExists(assignmentDir);

// const assignmentStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, assignmentDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });
// const uploadAssignment = multer({ storage: assignmentStorage });

// //
// // 🔹 Student Submission Storage
// //
// const studentSubmissionDir = path.join(__dirname, '../../uploads/student-submissions');
// ensureFolderExists(studentSubmissionDir);

// const studentSubmissionStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/student-submissions/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// const uploadStudentSubmission = multer({ storage: studentSubmissionStorage });

// //
// // 🔹 Instructor File Upload Storage
// //
// const instructorDir = path.join(__dirname, '../../uploads/instructor-files');
// ensureFolderExists(instructorDir);

// const instructorStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, instructorDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   }
// });
// const uploadInstructorFile = multer({ storage: instructorStorage });

// //
// // ✅ Export all uploaders
// //
// module.exports = {
//   uploadAssignment,
//   uploadInstructorFile,
//   uploadStudentSubmission,
// };

const parser = require('./uploadCloudinary');

// 🔹 Assignment Upload Storage (now using Cloudinary)
const uploadAssignment = parser;

// 🔹 Student Submission Storage (also using Cloudinary)
const uploadStudentSubmission = parser;

// 🔹 Instructor File Upload Storage (also using Cloudinary)
const uploadInstructorFile = parser;

// ✅ Export all uploaders
module.exports = {
  uploadAssignment,
  uploadInstructorFile,
  uploadStudentSubmission,
};
