const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-course", authMiddleware, courseController.createCourse);
router.get("/my-courses", authMiddleware, courseController.getInstructorCourses); // 👈 NEW

module.exports = router;
