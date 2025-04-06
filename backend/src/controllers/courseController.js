const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");

exports.getInstructorCourses = async (req, res) => {
    const instructor_id = req.user.id;
  
    try {
      const result = await pool.query(
        `SELECT * FROM courses WHERE instructor_id = $1 ORDER BY start_date DESC`,
        [instructor_id]
      );
  
      res.status(200).json({
        message: "Courses fetched successfully",
        courses: result.rows,
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  // Add to your courseController.js
exports.getCourseById = async (req, res) => {
  const courseId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ course: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    await pool.query('DELETE FROM courses WHERE id = $1', [courseId]);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const {
    department,
    number,
    name,
    term,
    start_date,
    end_date,
    credits,
    is_published,
    is_active,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE courses SET 
        department=$1, number=$2, name=$3, term=$4, start_date=$5, end_date=$6,
        credits=$7, is_published=$8, is_active=$9
       WHERE id=$10 RETURNING *`,
      [department, number, name, term, start_date, end_date, credits, is_published, is_active, id]
    );

    res.status(200).json({ message: "Course updated", course: result.rows[0] });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

  
exports.createCourse = async (req, res) => {
  const {
    department,
    number,
    name,
    term,
    start_date,
    end_date,
    credits,
    is_published = false,
    is_active = true,
  } = req.body;

  const instructor_id = req.user.id; // From JWT
  const course_id = uuidv4(); // ✅ Generate UUID for course ID

  if (!department || !number || !name || !term || !start_date || !end_date || !credits) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO courses 
        (id, department, number, name, term, start_date, end_date, instructor_id, credits, is_published, is_active)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        course_id,
        department,
        number,
        name,
        term,
        start_date,
        end_date,
        instructor_id,
        credits,
        is_published,
        is_active,
      ]
    );

    res.status(201).json({
      message: "Course created successfully",
      course: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
