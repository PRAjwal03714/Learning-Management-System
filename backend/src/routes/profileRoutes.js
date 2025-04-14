const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/profile/' });
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const profileController = require('../controllers/instructorProfileController');

router.get('/me', authMiddleware, profileController.getProfile);
router.put('/update', authMiddleware, upload.single('profile_picture'), profileController.updateProfile);
router.put('/remove-photo', authMiddleware, profileController.removeProfilePhoto);

module.exports = router;