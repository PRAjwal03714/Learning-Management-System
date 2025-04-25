const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'studymate_uploads',
    allowed_formats: ['jpg', 'png', 'pdf', 'docx'],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // optional
  },
});

const parser = multer({ storage });

module.exports = parser;
