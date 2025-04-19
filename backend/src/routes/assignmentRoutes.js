const express = require('express');
const router = express.Router();
const { authMiddleware,  } = require('../middlewares/authMiddleware');
const { uploadAssignment,uploadStudentSubmission } = require('../middlewares/uploadMiddleware');
const {
  createAssignment,
  getAllInstructorAssignments,
  getAssignmentsByCourse,
  getStudentAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  deleteAssignmentFile,
  submitAssignment,
  getStudentSubmission,getSubmissionsByCourse, gradeSubmission, getPublishedAssignments,getStudentSubmissionsByAssignment
} = require('../controllers/assignmentController');

router.get('/published/:courseId', authMiddleware, getPublishedAssignments);

// Routes
router.post('/create', authMiddleware, uploadAssignment.array('files'), createAssignment);
router.get('/all', authMiddleware, getAllInstructorAssignments);
router.get('/by-course/:courseId', authMiddleware, getAssignmentsByCourse);
router.get('/student', authMiddleware, getStudentAssignments);
router.get('/:assignmentId', authMiddleware, getAssignmentById);
router.put('/:assignmentId', authMiddleware, uploadAssignment.array('files'), updateAssignment);
router.delete('/:assignmentId', authMiddleware, deleteAssignment);
router.delete('/:assignmentId/files/:fileId', authMiddleware, deleteAssignmentFile);

// 🆕 Student submission routes
router.post('/:assignmentId/submit', authMiddleware, uploadStudentSubmission.array('files'), submitAssignment);
router.get('/:assignmentId/submission', authMiddleware, getStudentSubmission);

router.get('/:courseId/submissions', authMiddleware, getSubmissionsByCourse);
router.put('/submission/:submissionId/grade', authMiddleware, gradeSubmission);
router.get('/:assignmentId/student-submissions', authMiddleware, getStudentSubmissionsByAssignment);

module.exports = router;
