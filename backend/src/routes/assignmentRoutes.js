// const express = require('express');
// const router = express.Router();
// const assignmentController = require('../controllers/assignmentController');
// const { authMiddleware } = require('../middlewares/authMiddleware');

// // Reuse multer from controller
// const { upload } = assignmentController;

// // Routes
// router.post(
//   '/create',
//   authMiddleware,
//   upload,
//   assignmentController.createAssignment
// );

// router.get('/by-course/:courseId', authMiddleware, assignmentController.getAssignmentsByCourse);
// router.get('/:assignmentId', authMiddleware, assignmentController.getAssignmentById);
// router.put('/:assignmentId', authMiddleware, upload, assignmentController.updateAssignment);
// router.delete('/:assignmentId', authMiddleware, assignmentController.deleteAssignment);
// router.delete('/:assignmentId/files/:fileId', authMiddleware, assignmentController.deleteAssignmentFile);

// module.exports = router;
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { uploadAssignment } = require('../middlewares/uploadMiddleware');

router.post(
  '/create',
  authMiddleware,
  uploadAssignment.array('files'), // accepts multiple
  assignmentController.createAssignment
);
router.get('/all', authMiddleware, assignmentController.getAllInstructorAssignments);

router.get('/by-course/:courseId', authMiddleware, assignmentController.getAssignmentsByCourse);
router.get('/:assignmentId', authMiddleware, assignmentController.getAssignmentById);
router.put(
  '/:assignmentId',
  authMiddleware,
  uploadAssignment.array('files'),
  assignmentController.updateAssignment
);
router.delete('/:assignmentId', authMiddleware, assignmentController.deleteAssignment);
router.delete('/:assignmentId/files/:fileId', authMiddleware, assignmentController.deleteAssignmentFile);

module.exports = router;
