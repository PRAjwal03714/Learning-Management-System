const pool = require('../config/db');

exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const instructorRes = await pool.query(
      `SELECT id, instructor_id, is_approved, biography, links, profile_picture 
       FROM instructors 
       WHERE user_id = $1`,
      [userId]
    );

    if (instructorRes.rows.length === 0) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const instructor = instructorRes.rows[0];

    const userRes = await pool.query(
      `SELECT name, email FROM users WHERE id = $1`,
      [userId]
    );

    const user = userRes.rows[0];

    const coursesRes = await pool.query(
      `SELECT id, name, term, department, number 
       FROM courses 
       WHERE instructor_id = $1`,
      [userId]
    );

    let parsedLinks = [];
    try {
      parsedLinks = instructor.links ? JSON.parse(instructor.links) : [];
    } catch (e) {
      console.warn('⚠️ Could not parse instructor.links:', e);
    }

    return res.status(200).json({
      instructor_id: instructor.instructor_id,
      name: user.name,
      email: user.email,
      is_approved: instructor.is_approved,
      biography: instructor.biography || '',
      links: parsedLinks,
      profile_picture: instructor.profile_picture || '',
      courses: coursesRes.rows,
    });
  } catch (err) {
    console.error('❌ getProfile error:', err);
    return res.status(500).json({ message: 'Server error fetching instructor profile' });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { biography, links } = req.body;
  const filePath = req.file ? `/uploads/profile/${req.file.filename}` : null;

  try {
    await pool.query(
      `UPDATE instructors 
       SET biography = $1, 
           links = $2, 
           profile_picture = COALESCE($3, profile_picture) 
       WHERE user_id = $4`,
      [biography, JSON.stringify(links || []), filePath, userId]
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
exports.removeProfilePhoto = async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query(
      `UPDATE instructors SET profile_picture = NULL WHERE user_id = $1`,
      [userId]
    );

    res.status(200).json({ message: 'Profile picture removed' });
  } catch (err) {
    console.error('❌ Error removing profile picture:', err);
    res.status(500).json({ message: 'Failed to remove profile picture' });
  }
};
