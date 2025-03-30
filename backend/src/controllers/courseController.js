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
