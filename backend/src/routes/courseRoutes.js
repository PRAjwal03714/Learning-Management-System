const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-course", authMiddleware, courseController.createCourse);
router.get("/my-courses", authMiddleware, courseController.getInstructorCourses); // 👈 NEW
router.get('/:id', authMiddleware, courseController.getCourseById);
router.delete('/:id', authMiddleware, courseController.deleteCourse);
router.put('/update-course/:id', authMiddleware, courseController.updateCourse);

module.exports = router;
