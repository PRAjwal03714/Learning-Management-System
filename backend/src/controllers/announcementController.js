const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");


exports.getAnnouncements = async (req, res) => {
  const course_id = req.params.course_id;

  if (!course_id) {
    return res.status(400).json({ message: "Course ID is required" });
  }

  try {
    // 🔍 Optional: Validate course existence
    const courseCheck = await pool.query(
      "SELECT * FROM courses WHERE id = $1",
      [course_id]
    );

    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 📥 Get announcements
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
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Server error" });
  }
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
