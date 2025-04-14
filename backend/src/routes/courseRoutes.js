const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-course", authMiddleware, courseController.createCourse);
router.get("/my-courses", authMiddleware, courseController.getInstructorCourses); // 👈 NEW
router.delete('/:id', authMiddleware, courseController.deleteCourse);
router.put('/update-course/:id', authMiddleware, courseController.updateCourse);
// Students can view all available courses

router.get('/available', courseController.getAllAvailableCourses); // ✅ move this up
router.get('/:id', authMiddleware, courseController.getCourseById); // ⬇️ keep this below

router.post('/enroll', authMiddleware, courseController.registerCourse);
router.post('/unenroll', authMiddleware, courseController.unregisterCourse);
router.get('/my-registered-courses', authMiddleware, courseController.getStudentRegisteredCourses);

module.exports = router;
