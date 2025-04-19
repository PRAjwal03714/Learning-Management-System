// assignmentRoutes.js

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { uploadAssignment, uploadStudentSubmission } = require('../middlewares/uploadMiddleware');

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
  getStudentSubmission,
  getAssignmentsForCourse,
  getAssignmentSubmissions,
  gradeSubmission,
  getPublishedAssignments,
  getStudentGradesByCourse
} = require('../controllers/assignmentController');

// 🔵 Published assignments (for students)
router.get('/student/grades/:courseId', authMiddleware, getStudentGradesByCourse);
router.get('/published/:courseId', authMiddleware, getPublishedAssignments);

// 🔵 Assignment management (Instructor)
router.post('/create', authMiddleware, uploadAssignment.array('files'), createAssignment);
router.get('/all', authMiddleware, getAllInstructorAssignments);
router.get('/by-course/:courseId', authMiddleware, getAssignmentsByCourse);

// 🔵 Student submission
router.post('/:assignmentId/submit', authMiddleware, uploadStudentSubmission.array('files'), submitAssignment);
router.get('/:assignmentId/submission', authMiddleware, getStudentSubmission);

// 🔵 Instructor view of assignments inside a course (for Grades page dropdown)
router.get('/course/:courseId', authMiddleware, getAssignmentsForCourse);

// 🔵 Instructor fetching submissions for one assignment
router.get('/:assignmentId/submissions', authMiddleware, getAssignmentSubmissions);

// 🔵 Instructor grading a submission
router.post('/submission/:submissionId/grade', authMiddleware, gradeSubmission);

// 🔵 Assignment Details (keep LAST always)
router.get('/:assignmentId', authMiddleware, getAssignmentById);
router.put('/:assignmentId', authMiddleware, uploadAssignment.array('files'), updateAssignment);
router.delete('/:assignmentId', authMiddleware, deleteAssignment);
router.delete('/:assignmentId/files/:fileId', authMiddleware, deleteAssignmentFile);

module.exports = router;
