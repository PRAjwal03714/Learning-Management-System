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
        ss.file_name,
        ss.original_name,
        ss.grade,
        ss.attempt_number,
        ss.created_at
      FROM student_submissions ss
      JOIN assignments a ON ss.assignment_id = a.id
      JOIN users u ON ss.student_id = u.id
      WHERE a.course_id = $1
      ORDER BY ss.created_at DESC
    `, [courseId]);

    res.json({ submissions: result.rows });
  } catch (err) {
    console.error('Error fetching submissions by course:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Grade a student's submission
exports.gradeSubmission = async (req, res) => {
  const { marks } = req.body;
  const { submissionId } = req.params; // <- we don't use submissionId anymore

  try {
    // First find the assignment_id, student_id, and attempt_number based on submissionId
    const submissionResult = await pool.query(
      `SELECT student_id, assignment_id, attempt_number
       FROM student_submissions
       WHERE id = $1`,
      [submissionId]
    );

    if (submissionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const { student_id, assignment_id, attempt_number } = submissionResult.rows[0];

    // Now update ALL submissions matching student_id, assignment_id, attempt_number
    await pool.query(
      `UPDATE student_submissions
       SET grade = $1
       WHERE student_id = $2
         AND assignment_id = $3
         AND attempt_number = $4`,
      [marks, student_id, assignment_id, attempt_number]
    );

    res.json({ message: 'Grade updated successfully' });
  } catch (err) {
    console.error('Error updating grade:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get student's submissions for an assignment
// controllers/assignmentController.js

exports.getStudentSubmission = async (req, res) => {
  const studentId = req.user.id;
  const { assignmentId } = req.params;

  try {
    const submissionRes = await pool.query(`
      SELECT 
        attempt_number,
        json_agg(
          json_build_object(
            'file_name', file_name,
            'original_name', original_name,
            'uploaded_at', created_at
          ) ORDER BY created_at
        ) AS files
      FROM student_submissions
      WHERE assignment_id = $1 AND student_id = $2
      GROUP BY attempt_number
      ORDER BY attempt_number ASC
    `, [assignmentId, studentId]);

    const submissions = submissionRes.rows || [];

    res.json({ submissions });
  } catch (err) {
    console.error("🔥 Error fetching submissions:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Submit assignment
exports.submitAssignment = async (req, res) => {
  const studentId = req.user.id;
  const { assignmentId } = req.params;
  const files = req.files;

  try {
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Get the next attempt number
    const attemptRes = await pool.query(`
      SELECT COALESCE(MAX(attempt_number), 0) + 1 as next_attempt
      FROM student_submissions
      WHERE student_id = $1 AND assignment_id = $2
    `, [studentId, assignmentId]);

    const nextAttempt = attemptRes.rows[0].next_attempt;

    // Insert each file as a new submission
    for (const file of files) {
      await pool.query(`
        INSERT INTO student_submissions (
          student_id,
          assignment_id,
          file_name,
          original_name,
          attempt_number,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      `, [
        studentId,
        assignmentId,
        file.filename,
        file.originalname,
        nextAttempt
      ]);
    }

    res.status(201).json({
      message: 'Assignment submitted successfully',
      attemptNumber: nextAttempt
    });
  } catch (err) {
    console.error('Error submitting assignment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all submissions for an assignment grouped by attempt
exports.getStudentSubmissionsByAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const instructorId = req.user.id;

  try {
    // Step 1: Verify that instructor owns the assignment
    const assignmentCheck = await pool.query(`
      SELECT a.id 
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = $1 AND c.instructor_id = $2
    `, [assignmentId, instructorId]);

    if (assignmentCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to view these submissions' });
    }

    // Step 2: Get the latest attempt per student for this assignment
    const result = await pool.query(`
      WITH LatestSubmissions AS (
        SELECT 
          student_id,
          MAX(attempt_number) as latest_attempt
        FROM student_submissions
        WHERE assignment_id = $1
        GROUP BY student_id
      )
      SELECT 
        ss.id as submission_id,
        ss.student_id,
        u.name as student_name,
        ss.attempt_number,
        ss.grade,
        ss.created_at as submitted_at,
        a.marks as total_marks,
        ss.file_name,
        ss.original_name
      FROM student_submissions ss
      JOIN users u ON ss.student_id = u.id
      JOIN assignments a ON ss.assignment_id = a.id
      JOIN LatestSubmissions ls
        ON ss.student_id = ls.student_id
        AND ss.attempt_number = ls.latest_attempt
        AND ss.assignment_id = $1
      ORDER BY u.name ASC, ss.created_at ASC
    `, [assignmentId]);

    // Step 3: Group files per student
    const grouped = {};
    result.rows.forEach(row => {
      if (!grouped[row.student_id]) {
        grouped[row.student_id] = {
          submission_id: row.submission_id,
          student_id: row.student_id,
          student_name: row.student_name,
          attempt_number: row.attempt_number,
          grade: row.grade,
          submitted_at: row.submitted_at,
          total_marks: row.total_marks,
          files: []
        };
      }
      grouped[row.student_id].files.push({
        file_name: row.file_name,
        original_name: row.original_name
      });
    });

    const submissions = Object.values(grouped);

    return res.json({ submissions });
  } catch (err) {
    console.error('Error in getStudentSubmissionsByAssignment:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};



exports.getAllInstructorAssignments = async (req, res) => {
  const instructorId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT a.*, a.title as course_title
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE c.instructor_id = $1
      ORDER BY a.created_at DESC
    `, [instructorId]);
    res.json({ assignments: result.rows });
  } catch (err) {
    console.error('Error fetching instructor assignments:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAssignmentsByCourse = async (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT a.*,
        COALESCE(json_agg(
          json_build_object(
            'id', af.id,
            'url', af.url,
            'name', af.name
          )
        ) FILTER (WHERE af.id IS NOT NULL), '[]') AS files
      FROM assignments a
      LEFT JOIN assignment_files af ON a.id = af.assignment_id
      JOIN courses c ON a.course_id = c.id
      WHERE c.id = $1 AND c.instructor_id = $2
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `, [courseId, instructorId]);
    
    res.json({ assignments: result.rows });
  } catch (err) {
    console.error('Error fetching course assignments:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.getStudentAssignments = async (req, res) => {
  const studentId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT a.*, a.title as course_title
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      JOIN student_courses sc ON c.id = sc.course_id
      WHERE sc.student_id = $1 AND a.is_published = true
      ORDER BY a.due_date ASC
    `, [studentId]);
    res.json({ assignments: result.rows });
  } catch (err) {
    console.error('Error fetching student assignments:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getPublishedAssignments = async (req, res) => {
  const { courseId } = req.params;
  try {
    const assignmentsRes = await pool.query(`
      SELECT *
      FROM assignments
      WHERE course_id = $1 AND is_published = true
      ORDER BY created_at DESC
    `, [courseId]);

    const assignments = assignmentsRes.rows;

    // For each assignment, fetch its files
    const assignmentsWithFiles = await Promise.all(
      assignments.map(async (assignment) => {
        const filesRes = await pool.query(`
          SELECT id, name, url
          FROM assignment_files
          WHERE assignment_id = $1
        `, [assignment.id]);

        return {
          ...assignment,
          files: filesRes.rows || [],
        };
      })
    );

    res.json({ assignments: assignmentsWithFiles });
  } catch (err) {
    console.error('Error fetching published assignments:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignmentResult = await pool.query(`
      SELECT a.*, c.name as course_name
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = $1
    `, [assignmentId]);

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const assignment = assignmentResult.rows[0];

    const filesResult = await pool.query(`
      SELECT id, name, url
      FROM assignment_files
      WHERE assignment_id = $1
      ORDER BY uploaded_at ASC
    `, [assignmentId]);

    assignment.files = filesResult.rows; // ✅ Attach files array

    res.json({ assignment });
  } catch (err) {
    console.error('Error fetching assignment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Update assignment
exports.updateAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { title, description, due_date, marks, is_published, comment, file_url } = req.body;
  const instructorId = req.user.id;
  const files = req.files;

  try {
    // Verify instructor access
    const accessCheck = await pool.query(`
      SELECT a.id
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = $1 AND c.instructor_id = $2
    `, [assignmentId, instructorId]);

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this assignment' });
    }

    // Update assignment details
    await pool.query(`
      UPDATE assignments
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        due_date = COALESCE($3, due_date),
        marks = COALESCE($4, marks),
        is_published = COALESCE($5, is_published),
        created_at = CURRENT_TIMESTAMP,
        comment=COALESCE($6, comment),
        file_url=COALESCE($7, file_url)
      WHERE id = $8
    `, [title, description, due_date, marks, is_published, comment,file_url, assignmentId]);

    // Handle new files if any
    if (files && files.length > 0) {
      for (const file of files) {
        await pool.query(
          `INSERT INTO assignment_files (assignment_id, url, name)
           VALUES ($1, $2, $3)`,
          [assignmentId, file.filename, file.originalname]
        );
      }
    }

    res.json({ message: 'Assignment updated successfully' });
  } catch (err) {
    console.error('Error updating assignment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const instructorId = req.user.id;

  try {
    // Verify instructor access
    const accessCheck = await pool.query(`
      SELECT a.id
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = $1 AND c.instructor_id = $2
    `, [assignmentId, instructorId]);

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this assignment' });
    }

    await pool.query('DELETE FROM assignments WHERE id = $1', [assignmentId]);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error('Error deleting assignment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete assignment file
exports.deleteAssignmentFile = async (req, res) => {
  const { assignmentId, fileId } = req.params;
  const instructorId = req.user.id;

  try {
    // Verify instructor access
    const accessCheck = await pool.query(`
      SELECT a.id
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = $1 AND c.instructor_id = $2
    `, [assignmentId, instructorId]);

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this file' });
    }

    await pool.query(
      'DELETE FROM assignment_files WHERE id = $1 AND assignment_id = $2',
      [fileId, assignmentId]
    );
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error deleting assignment file:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// CREATE
exports.createAssignment = async (req, res) => {
  const { title, description, due_date, marks, course_id, comment, is_published } = req.body;
  const files = req.files;
  const instructorId = req.user.id;

  try {
    // Verify course ownership
    const courseCheck = await pool.query(
      `SELECT id FROM courses WHERE id = $1 AND instructor_id = $2`,
      [course_id, instructorId]
    );

    if (courseCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to create assignments for this course' });
    }

    const result = await pool.query(
      `INSERT INTO assignments (title, description, due_date, marks, course_id, comment, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [title, description, due_date, marks, course_id, comment, is_published]
    );

    const assignmentId = result.rows[0].id;

    if (files && files.length > 0) {
      for (const file of files) {
        await pool.query(
          `INSERT INTO assignment_files (assignment_id, url, name)
           VALUES ($1, $2, $3)`,
          [assignmentId, `/uploads/assignments/${file.filename}`, file.originalname]
        );
      }
    }

    res.status(201).json({ 
      message: 'Assignment created successfully',
      assignmentId 
    });
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Get assignments for a course (for instructor grading)
exports.getAssignmentsForCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, title FROM assignments WHERE course_id = $1 ORDER BY created_at DESC`,
      [courseId]
    );
    res.json({ assignments: result.rows });
  } catch (err) {
    console.error('Error fetching assignments for course:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all submissions for a particular assignment
exports.getSubmissionsForAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        s.id AS submission_id,
        u.name AS student_name,
        s.attempt_number,
        s.marks,
        s.created_at AS submitted_at,
        ss.file_name,
        ss.original_name
      FROM submissions s
      INNER JOIN users u ON s.student_id = u.id
      LEFT JOIN student_submission_files ss ON ss.submission_id = s.id
      WHERE s.assignment_id = $1
      ORDER BY s.created_at DESC
    `, [assignmentId]);

    res.json({ submissions: result.rows });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Grade a student's submission
exports.gradeSubmissions = async (req, res) => {
  const { submissionId } = req.params;
  const { grade } = req.body;

  try {
    await pool.query(
      `UPDATE student_submissions SET grade = $1 WHERE id = $2`,
      [grade, submissionId]
    );
    res.json({ message: 'Submission graded successfully' });
  } catch (err) {
    console.error('Error grading submission:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// src/controllers/assignmentController.js

exports.getAssignmentSubmissions = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const result = await pool.query(`
WITH latest_attempts AS (
  SELECT student_id, MAX(attempt_number) AS latest_attempt
  FROM student_submissions
  WHERE assignment_id = $1
  GROUP BY student_id
)
SELECT 
  (ARRAY_AGG(ss.id ORDER BY ss.created_at DESC))[1] AS submission_id,
  ss.student_id,
  u.name AS student_name,
  ss.attempt_number,
  MAX(ss.created_at) AS submitted_at,
  MAX(ss.grade) AS grade,
  a.marks AS total_marks,  -- ✅ ADD THIS LINE to fetch maximum marks
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'file_name', ss.file_name,
      'original_name', ss.original_name
    )
  ) AS files
FROM student_submissions ss
JOIN users u ON u.id = ss.student_id
JOIN assignments a ON ss.assignment_id = a.id
JOIN latest_attempts la ON ss.student_id = la.student_id AND ss.attempt_number = la.latest_attempt
WHERE ss.assignment_id = $1
GROUP BY ss.student_id, ss.attempt_number, u.name, a.marks
ORDER BY submitted_at DESC;


    `, [assignmentId]);

    res.json({ submissions: result.rows });
  } catch (err) {
    console.error('🔥 Error fetching assignment submissions:', err);
    res.status(500).json({ error: 'Failed to fetch assignment submissions' });
  }
};
// Get student's grades for a course
// ✅ For students to view their grades for a course
exports.getStudentGradesByCourse = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT 
        a.id AS assignment_id,
        a.title AS assignment_title,
        a.due_date,
        MAX(ss.created_at) AS submitted_at,
        MAX(ss.grade) AS marks_scored,
        a.marks AS total_marks
      FROM assignments a
      LEFT JOIN student_submissions ss 
        ON a.id = ss.assignment_id 
        AND ss.student_id = $1
      WHERE a.course_id = $2
      GROUP BY a.id
      ORDER BY a.due_date ASC
    `, [studentId, courseId]);

    res.status(200).json({ grades: result.rows });
  } catch (err) {
    console.error('Error fetching student grades:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

