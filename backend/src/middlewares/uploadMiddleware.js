// const multer = require('multer');
// const path = require('path');

// // Set up storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/assignments/'); // ensure this folder exists!
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;
const fs = require('fs');

const multer = require('multer');
const path = require('path');

//
// 🔹 Assignment Upload Storage
//
const assignmentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/assignments/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const uploadAssignment = multer({ storage: assignmentStorage });

//
// 🔹 Instructor File Upload Storage
//
const instructorDir = path.join(__dirname, '../../uploads/instructor-files');
if (!fs.existsSync(instructorDir)) {
  fs.mkdirSync(instructorDir, { recursive: true });
}

const instructorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, instructorDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const uploadInstructorFile = multer({ storage: instructorStorage });


//
// ✅ Export both
//
module.exports = {
  uploadAssignment,
  uploadInstructorFile,
};
