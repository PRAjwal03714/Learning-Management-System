const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-course", authMiddleware, courseController.createCourse);
router.get("/my-courses", authMiddleware, courseController.getInstructorCourses);
router.get("/available", authMiddleware, courseController.getAllAvailableCourses);
router.get("/my-registered-courses", authMiddleware, courseController.getStudentRegisteredCourses);
router.post("/enroll", authMiddleware, courseController.registerCourse);
router.post("/unenroll", authMiddleware, courseController.unregisterCourse);
router.put("/update-course/:id", authMiddleware, courseController.updateCourse);
router.delete("/:id", authMiddleware, courseController.deleteCourse);

// ✅ Move this to the very bottom!
router.get("/:id", authMiddleware, courseController.getCourseById);


module.exports = router;
