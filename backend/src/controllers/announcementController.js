const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");


// 📁 backend/controllers/announcementController.js

// Inside announcementController.js
exports.getAllInstructorAnnouncements = async (req, res) => {
  const instructor_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT a.id, a.title, a.content, a.created_at, c.name AS course_title
       FROM announcements a
       JOIN courses c ON a.course_id = c.id
       WHERE a.instructor_id = $1
       ORDER BY a.created_at DESC`,
      [instructor_id]
    );

    res.status(200).json({
      total: result.rows.length,
      announcements: result.rows,
    });
  } catch (error) {
    console.error('Error fetching all instructor announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAnnouncements = async (req, res) => {
  const course_id = req.params.course_id;
  // console.log("📥 /api/announcements/:course_id hit");
  console.log("➡️ course_id:", course_id);

  try {
    const courseCheck = await pool.query(
      "SELECT * FROM courses WHERE id = $1",
      [course_id]
    );

    // console.log("📦 courseCheck result:", courseCheck.rows);

    if (courseCheck.rows.length === 0) {
      console.log("❌ No course found");
      return res.status(404).json({ message: "Course not found" }); // <-- IMPORTANT!
    }

    const announcements = await pool.query(
      `SELECT id, title, content, created_at
       FROM announcements
       WHERE course_id = $1
       ORDER BY created_at DESC`,
      [course_id]
    );

    res.json({
      course: courseCheck.rows[0].name,
      total: announcements.rows.length,
      announcements: announcements.rows,
    });

  } catch (error) {
    console.error("🔥 Server error:", error);
    res.status(500).json({ message: "Internal server error" }); // <-- Always return message
  }
};
exports.updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const instructor_id = req.user.id;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    // Check if announcement belongs to instructor
    const check = await pool.query(
      "SELECT * FROM announcements WHERE id = $1 AND instructor_id = $2",
      [id, instructor_id]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ message: "You are not authorized to edit this announcement" });
    }

    const updated = await pool.query(
      `UPDATE announcements SET title = $1, content = $2 WHERE id = $3 RETURNING *`,
      [title, content, id]
    );

    res.status(200).json({
      message: "Announcement updated successfully",
      announcement: updated.rows[0],
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAnnouncementById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM announcements WHERE id = $1", [id]);
  if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
  res.json(result.rows[0]);
};

exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  const instructor_id = req.user.id;
  const check = await pool.query("SELECT * FROM announcements WHERE id = $1 AND instructor_id = $2", [id, instructor_id]);
  if (check.rows.length === 0) return res.status(403).json({ message: "Unauthorized" });

  await pool.query("DELETE FROM announcements WHERE id = $1", [id]);
  res.json({ message: "Deleted successfully" });
};



exports.createAnnouncement = async (req, res) => {
  const instructor_id = req.user.id;
  const { course_id, title, content } = req.body;

  if (!course_id || !title || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Check if instructor owns the course
    const courseCheck = await pool.query(
      "SELECT * FROM courses WHERE id = $1 AND instructor_id = $2",
      [course_id, instructor_id]
    );

    if (courseCheck.rows.length === 0) {
      return res.status(403).json({ message: "You are not authorized to post for this course." });
    }

    // ✅ Insert announcement
    const result = await pool.query(
      `INSERT INTO announcements (id, course_id, instructor_id, title, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [uuidv4(), course_id, instructor_id, title, content]
    );

    res.status(201).json({
      message: "Announcement posted successfully",
      announcement: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Server error" });
  }
};
