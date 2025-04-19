const pool = require("../config/db");

// Get all student submissions for a course
exports.getSubmissionsByCourse = async (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT 
        ss.id AS submission_id,
        ss.student_id,
        u.name AS student_name,
        a.title AS assignment_title,
        ss.file_url,
        ss.grade
      FROM student_submissions ss
      JOIN assignments a ON ss.assignment_id = a.id
      JOIN users u ON ss.student_id = u.id
      WHERE a.course_id = $1
    `, [courseId]);

    res.json({ submissions: result.rows });
  } catch (err) {
    console.error('❌ Error fetching submissions by course:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Grade a student's submission
exports.gradeSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { grade } = req.body;

  try {
    await pool.query(
      `UPDATE student_submissions SET grade = $1 WHERE id = $2`,
      [grade, submissionId]
    );

    res.json({ message: 'Grade updated successfully' });
  } catch (err) {
    console.error('❌ Error grading submission:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Student submit assignment
exports.submitAssignment = async (req, res) => {
  const studentId = req.user.id;
  const { assignmentId } = req.params;
  const files = req.files; // 🔥 not req.file!

  try {
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // 🔥 Find the latest attempt number
    const attemptRes = await pool.query(`
      SELECT MAX(attempt_number) AS max_attempt
      FROM student_submissions
      WHERE assignment_id = $1 AND student_id = $2
    `, [assignmentId, studentId]);

    const nextAttempt = (attemptRes.rows[0].max_attempt || 0) + 1;

    // 🔥 Insert each file
    for (const file of files) {
      await pool.query(
        `INSERT INTO student_submissions (student_id, assignment_id, file_url, attempt_number)
         VALUES ($1, $2, $3, $4)`,
        [studentId, assignmentId, `/uploads/student-submissions/${file.filename}`, nextAttempt]
      );
    }

    res.status(201).json({ message: 'Assignment submitted successfully' });
  } catch (err) {
    console.error('❌ Error submitting assignment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get all submissions for an assignment grouped by attempt
exports.getStudentSubmissionsByAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const studentId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, file_url, attempt_number FROM student_submissions
       WHERE assignment_id = $1 AND student_id = $2
       ORDER BY attempt_number ASC`,
      [assignmentId, studentId]
    );
    res.json({ submissions: result.rows });
  } catch (err) {
    console.error('❌ Error fetching submissions:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// controllers/assignmentController.js

exports.getStudentSubmission = async (req, res) => {
  const studentId = req.user.id;
  const { assignmentId } = req.params;

  try {
    const submissionRes = await pool.query(`
      SELECT id, assignment_id, file_url, created_at, attempt_number
      FROM student_submissions
      WHERE assignment_id = $1 AND student_id = $2
      ORDER BY attempt_number ASC, created_at ASC
    `, [assignmentId, studentId]);

    const submissions = submissionRes.rows || [];

    // Group by attempt
    const grouped = {};
    for (const sub of submissions) {
      if (!grouped[sub.attempt_number]) {
        grouped[sub.attempt_number] = [];
      }
      grouped[sub.attempt_number].push(sub);
    }

    const result = Object.keys(grouped).map(attemptNumber => ({
      attempt_number: parseInt(attemptNumber),
      files: grouped[attemptNumber]
    }));

    res.json({ submissions: result });
  } catch (err) {
    console.error("🔥 Error fetching submissions:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



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
exports.getPublishedAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;

    const assignmentRes = await pool.query(
      `SELECT * FROM assignments WHERE course_id = $1 AND is_published = true ORDER BY created_at DESC`,
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
    console.error('❌ Error in getPublishedAssignments:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// CREATE
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, due_date, course_id, is_published, comment, marks } = req.body;
    const files = req.files;

    const instructor_id = req.user.id; // 🔥 Get logged-in instructor ID

    const assignmentRes = await pool.query(
      `INSERT INTO assignments (title, description, due_date, course_id, is_published, comment, marks, instructor_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, due_date, course_id, is_published === 'true', comment, marks, instructor_id]
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

exports.getStudentAssignments = async (req, res) => {
  const studentId = req.user.id;

  try {
    const assignmentsRes = await pool.query(`
      SELECT 
        a.id, a.title, a.due_date,
        c.id AS course_id,
        c.name AS course_title
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      JOIN student_courses sc ON sc.course_id = c.id
      WHERE sc.student_id = $1
      ORDER BY a.due_date ASC
    `, [studentId]);

    res.json({ assignments: assignmentsRes.rows });
  } catch (err) {
    console.error("❌ Error fetching student assignments:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
