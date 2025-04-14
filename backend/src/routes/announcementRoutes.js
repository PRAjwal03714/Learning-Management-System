const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  getAnnouncementById,
  deleteAnnouncement,
  getAllInstructorAnnouncements
} = require("../controllers/announcementController");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, createAnnouncement);
router.get('/all', authMiddleware, getAllInstructorAnnouncements);
router.get("/by-course/:course_id", authMiddleware, getAnnouncements);
router.get("/:id", authMiddleware, getAnnouncementById); // 🔽 THIS LAST
router.put("/:id", authMiddleware, updateAnnouncement);
router.delete("/:id", authMiddleware, deleteAnnouncement);


module.exports = router;
