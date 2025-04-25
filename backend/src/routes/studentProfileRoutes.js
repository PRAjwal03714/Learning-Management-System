const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/profile/' });
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const studentProfileController = require('../controllers/studentProfileController');
const parser = require('../middlewares/uploadCloudinary');

router.get('/me', authMiddleware, studentProfileController.getProfile);
// router.put('/update', authMiddleware, upload.single('profile_picture'), studentProfileController.updateProfile);
router.put('/update', authMiddleware, parser.single('profile_picture'), studentProfileController.updateProfile);

router.put('/remove-photo', authMiddleware, studentProfileController.removeProfilePhoto);

module.exports = router;
