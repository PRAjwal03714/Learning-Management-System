// controllers/adminController.js
const pool = require("../config/db"); // PostgreSQL connection
const { v4: uuidv4 } = require('uuid');

exports.approveInstructor = async (req, res) => {
  const { instructorId } = req.body;

  if (!instructorId) {
    return res.status(400).json({ message: 'Instructor ID is required' });
  }

  try {
    const instructorRes = await pool.query(
      'SELECT * FROM instructors WHERE id = $1',
      [instructorId]
    );

    if (instructorRes.rowCount === 0) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const generatedInstructorID = `INST-${uuidv4().slice(0, 8)}`;

    const updateRes = await pool.query(
      `UPDATE instructors 
       SET is_approved = true, 
           approved_at = NOW(), 
           instructor_id = $1
       WHERE id = $2
       RETURNING *`,
      [generatedInstructorID, instructorId]
    );

    return res.status(200).json({
      message: 'Instructor approved successfully',
      instructor: updateRes.rows[0]
    });

  } catch (error) {
    console.error('Error approving instructor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
