const pool = require('../config/db');
const path = require('path');

// 1. Create Folder

exports.createFolder = async (req, res) => {
  const { course_id, name, parent_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO instructor_folders (course_id, name, parent_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [course_id, name, parent_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating folder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// 2. Upload File
exports.uploadFile = async (req, res) => {
  console.log('🔥 Upload endpoint hit');
  console.log('📁 File:', req.file);
  console.log('📦 Body:', req.body);
  const { course_id, folder_id } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const result = await pool.query(
      `INSERT INTO instructor_files (folder_id, course_id, name, url, type, size)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        folder_id || null,
        course_id,
        file.originalname,
        // `/uploads/instructor-files/${file.filename}`,
        file.path,
        file.mimetype,
        file.size
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 3. Get All Folders & Files for Course
exports.getFilesAndFolders = async (req, res) => {
  // console.log('🔥 GET /api/files/:courseId called with →', req.params.courseId);

  const { courseId } = req.params;
  try {
    const folders = await pool.query(
      'SELECT * FROM instructor_folders WHERE course_id = $1 ORDER BY created_at',
      [courseId]
    );
    const files = await pool.query(
      'SELECT * FROM instructor_files WHERE course_id = $1 ORDER BY uploaded_at',
      [courseId]
    );
    res.json({ folders: folders.rows, files: files.rows });
  } catch (err) {
    console.error('Error fetching files/folders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 4. Delete File
exports.deleteFile = async (req, res) => {
  const { fileId } = req.params;
  try {
    await pool.query('DELETE FROM instructor_files WHERE id = $1', [fileId]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 5. Delete Folder
exports.deleteFolder = async (req, res) => {
  const { folderId } = req.params;
  try {
    await pool.query('DELETE FROM instructor_folders WHERE id = $1', [folderId]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting folder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
