'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Assignment {
  id: string;
  title: string;
}

interface Submission {
  submission_id: string;
  student_id: string;
  student_name: string;
  attempt_number: number;
  submitted_at: string;
  grade: number | null;
  total_marks: number;
  files: { file_name: string; original_name: string }[];
}

export default function AssignmentGradesPage() {
  const { id: courseId } = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [isGraded, setIsGraded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  useEffect(() => {
    if (selectedAssignmentId) {
      fetchSubmissions(selectedAssignmentId);
    }
  }, [selectedAssignmentId]);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5001/api/assignments/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignments(res.data.assignments);
      if (res.data.assignments.length > 0) {
        setSelectedAssignmentId(res.data.assignments[0].id);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchSubmissions = async (assignmentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5001/api/assignments/${assignmentId}/submissions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newGrades: Record<string, string> = {};
      const gradedFlags: Record<string, boolean> = {};
      res.data.submissions.forEach((submission: Submission) => {
        const key = `${submission.student_id}-${submission.attempt_number}`;
        newGrades[key] = submission.grade !== null ? submission.grade.toString() : '';
        gradedFlags[key] = submission.grade !== null;
      });
      setSubmissions(res.data.submissions);
      setGrades(newGrades);
      setIsGraded(gradedFlags);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleGradeChange = (studentId: string, attemptNumber: number, value: string) => {
    setGrades((prev) => ({
      ...prev,
      [`${studentId}-${attemptNumber}`]: value,
    }));
  };

  const handleSaveGrade = async (submissionId: string, studentId: string, attemptNumber: number) => {
    const key = `${studentId}-${attemptNumber}`;
    const gradeValue = grades[key];

    if (!gradeValue.trim()) {
      alert('Grade cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5001/api/assignments/submission/${submissionId}/grade`,
        { marks: Number(gradeValue) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Grade saved successfully!');
      setIsGraded((prev) => ({ ...prev, [key]: true }));
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };

  return (
    <div className="p-8 -mt-8">
      <h1 className="text-3xl font-bold mb-6">Assignment Grades</h1>

      {/* Assignment Dropdown */}
      <div className="mb-6">
        <select
          value={selectedAssignmentId}
          onChange={(e) => setSelectedAssignmentId(e.target.value)}
          className="cursor-pointer border px-4 py-2 rounded"
        >
          {assignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions Table */}
      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions found</p>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Student</th>
                <th className="px-4 py-2 text-left font-semibold">Attempt</th>
                <th className="px-4 py-2 text-left font-semibold">Files</th>
                <th className="px-4 py-2 text-left font-semibold">Submitted At</th>
                <th className="px-4 py-2 text-left font-semibold">Grade</th>
                <th className="px-4 py-2 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => {
                const key = `${submission.student_id}-${submission.attempt_number}`;
                return (
                  <tr key={key} className="border-b">
                    <td className="px-4 py-4">{submission.student_name}</td>
                    <td className="px-4 py-4">{submission.attempt_number}</td>
                    <td className="px-4 py-4">
                      <ul className="list-disc list-inside">
                        {submission.files.map((file, index) => (
                          <li key={index}>
                            <a
                              href={`http://localhost:5001/uploads/student-submissions/${file.file_name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {file.original_name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4">
                      {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-4">
  <div className="flex items-center space-x-1">
    <input
      type="number"
      value={grades[key] || ''}
      onChange={(e) => handleGradeChange(submission.student_id, submission.attempt_number, e.target.value)}
      className="border rounded px-2 py-1 w-20 text-center font-semibold"
      disabled={isGraded[key]}
    />
    <span className="text-sm text-gray-500">/ {submission.total_marks}</span>
  </div>
</td>

                    <td className="px-4 py-4 flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleSaveGrade(submission.submission_id, submission.student_id, submission.attempt_number)}
                        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
                        disabled={isGraded[key]}
                      >
                        Grade
                      </button>
                      <button
                        onClick={() => setIsGraded((prev) => ({ ...prev, [key]: false }))}
                        className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
                        disabled={!isGraded[key]}
                      >
                        Regrade
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
