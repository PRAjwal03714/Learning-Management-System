const pool = require('../config/db');

exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const userRes = await pool.query(
      `SELECT id, name, email, biography, links, profile_picture FROM users WHERE id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRes.rows[0];

    const coursesRes = await pool.query(
      `SELECT c.id, c.name, c.term, c.department, c.number
       FROM courses c
       JOIN student_courses sc ON sc.course_id = c.id
       WHERE sc.student_id = $1`,
      [userId]
    );

    let parsedLinks = [];
    try {
      parsedLinks = user.links ? JSON.parse(user.links) : [];
    } catch {
      console.warn('⚠️ Could not parse user.links');
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      biography: user.biography || '',
      links: parsedLinks,
      profile_picture: user.profile_picture || '',
      courses: coursesRes.rows,
    });
  } catch (err) {
    console.error('❌ getStudentProfile error:', err);
    return res.status(500).json({ message: 'Server error fetching student profile' });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { biography, links } = req.body;
  // const filePath = req.file ? `/uploads/profile/${req.file.filename}` : null;
  const filePath = req.file ? req.file.path : null; // 🌩️ Cloudinary URL


  const rawLinks = req.body.links;
const parsedLinks = typeof rawLinks === 'string' ? rawLinks : JSON.stringify(rawLinks);


  try {
    await pool.query(
        `UPDATE users 
         SET biography = $1, 
             links = $2, 
             profile_picture = COALESCE($3, profile_picture) 
         WHERE id = $4`,
        [biography, parsedLinks, filePath, userId]
      );
      

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('❌ Error updating student profile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

exports.removeProfilePhoto = async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query(
      `UPDATE users SET profile_picture = NULL WHERE id = $1`,
      [userId]
    );

    res.status(200).json({ message: 'Profile picture removed' });
  } catch (err) {
    console.error('❌ Error removing student profile picture:', err);
    res.status(500).json({ message: 'Failed to remove profile picture' });
  }
};
