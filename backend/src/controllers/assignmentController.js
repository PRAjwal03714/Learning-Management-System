const pool = require("../config/db");


exports.getAllInstructorAssignments = async (req, res) => {
  const instructor_id = req.user.id;

  try {
    const result = await pool.query(`
      SELECT 
  a.id, a.title, a.description, a.due_date, a.created_at, a.is_published,
  c.name AS course_title,
  c.id AS course_id -- ✅ Add this
FROM assignments a
JOIN courses c ON a.course_id = c.id
WHERE c.instructor_id = $1
ORDER BY a.created_at DESC

    `, [instructor_id]);

    res.json({ assignments: result.rows });
  } catch (err) {
    console.error("🔥 Error fetching all instructor assignments:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// CREATE
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, due_date, course_id, is_published, comment } = req.body;
    const files = req.files;

    const assignmentRes = await pool.query(
      `INSERT INTO assignments (title, description, due_date, course_id, is_published, comment)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, due_date, course_id, is_published === 'true', comment]
    );
    const assignment = assignmentRes.rows[0];

    if (files && files.length > 0) {
      for (const file of files) {
        await pool.query(
          `INSERT INTO assignment_files (assignment_id, name, url)
           VALUES ($1, $2, $3)`,
          [assignment.id, file.originalname, `/uploads/assignments/${file.filename}`]
        );
      }
    }

    res.status(201).json({ assignment });
  } catch (err) {
    console.error("❌ Error creating assignment:", err);
    res.status(500).json({ error: "Assignment creation failed" });
  }
};

// GET ALL by Course
exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const assignmentRes = await pool.query(
      `SELECT * FROM assignments WHERE course_id = $1 ORDER BY created_at DESC`,
      [courseId]
    );
    const assignments = assignmentRes.rows;

    const fileRes = await pool.query(
      `SELECT * FROM assignment_files WHERE assignment_id = ANY($1::uuid[])`,
      [assignments.map((a) => a.id)]
    );

    const fileMap = {};
    for (const file of fileRes.rows) {
      if (!fileMap[file.assignment_id]) fileMap[file.assignment_id] = [];
      fileMap[file.assignment_id].push(file);
    }

    const assignmentsWithFiles = assignments.map((a) => ({
      ...a,
      files: fileMap[a.id] || [],
    }));

    res.json({ assignments: assignmentsWithFiles });
  } catch (err) {
    console.error('❌ Error in getAssignmentsByCourse:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET ONE
exports.getAssignmentById = async (req, res) => {
  const { assignmentId } = req.params;

  const assignmentRes = await pool.query(`SELECT * FROM assignments WHERE id = $1`, [assignmentId]);
  const assignment = assignmentRes.rows[0];

  const fileRes = await pool.query(
    `SELECT id, name, url FROM assignment_files WHERE assignment_id = $1`,
    [assignmentId]
  );

  assignment.files = fileRes.rows;
  res.json({ assignment });
};

// DELETE
exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    await pool.query(`DELETE FROM assignment_files WHERE assignment_id = $1`, [assignmentId]);
    await pool.query(`DELETE FROM assignments WHERE id = $1`, [assignmentId]);
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    console.error("❌ Error in deleteAssignment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE
exports.updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, due_date, is_published, comment } = req.body;
    const files = req.files;

    const result = await pool.query(
      `UPDATE assignments
       SET title = $1, description = $2, due_date = $3, is_published = $4, comment = $5
       WHERE id = $6 RETURNING *`,
      [title, description, due_date, is_published === 'true', comment, assignmentId]
    );

    if (files && files.length > 0) {
      for (const file of files) {
        await pool.query(
          `INSERT INTO assignment_files (assignment_id, name, url)
           VALUES ($1, $2, $3)`,
          [assignmentId, file.originalname, `/uploads/assignments/${file.filename}`]
        );
      }
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment updated", assignment: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating assignment:", err);
    res.status(500).json({ error: "Failed to update assignment" });
  }
};

// DELETE FILE
exports.deleteAssignmentFile = async (req, res) => {
  try {
    const { assignmentId, fileId } = req.params;
    const fileRes = await pool.query(
      `DELETE FROM assignment_files WHERE id = $1 AND assignment_id = $2 RETURNING *`,
      [fileId, assignmentId]
    );

    if (fileRes.rows.length === 0) {
      return res.status(404).json({ error: 'File not found or does not belong to assignment' });
    }

    res.json({ message: 'File deleted' });
  } catch (err) {
    console.error("❌ Error deleting assignment file:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
