const express = require("express");
const router = express.Router();
const { createAnnouncement, getAnnouncements } = require("../controllers/announcementController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const announcementController = require("../controllers/announcementController");

router.post("/create", authMiddleware, announcementController.createAnnouncement);
router.get("/:course_id", authMiddleware, getAnnouncements); // 🔥 This line

module.exports = router;
