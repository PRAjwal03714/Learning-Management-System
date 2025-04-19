'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Submission {
  submission_id: string;
  student_id: string;
  student_name: string;
  assignment_title: string;
  file_url: string;
  grade: number | null;
}

export default function GradesPage() {
  const { id: courseId } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetchSubmissions();
  }, [courseId]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/assignments/${courseId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      console.error('❌ Failed to fetch submissions:', err);
      toast.error('Failed to load submissions');
    }
  };

  const handleGradeChange = (submissionId: string, grade: number) => {
    setSubmissions(prev =>
      prev.map(sub =>
        sub.submission_id === submissionId ? { ...sub, grade } : sub
      )
    );
  };

  const handleGradeSubmit = async (submissionId: string, grade: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5001/api/assignments/submission/${submissionId}/grade`,
        { grade },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Grade updated successfully!');
    } catch (err) {
      console.error('❌ Failed to submit grade:', err);
      toast.error('Failed to update grade');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Grade Submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">Student</th>
                <th className="py-3 px-4 border-b text-left">Assignment</th>
                <th className="py-3 px-4 border-b text-left">File</th>
                <th className="py-3 px-4 border-b text-left">Grade</th>
                <th className="py-3 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.submission_id} className="border-b">
                  <td className="py-2 px-4">{sub.student_name}</td>
                  <td className="py-2 px-4">{sub.assignment_title}</td>
                  <td className="py-2 px-4">
                    <a
                      href={`http://localhost:5001${sub.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View File
                    </a>
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={sub.grade ?? ''}
                      onChange={(e) => handleGradeChange(sub.submission_id, parseInt(e.target.value))}
                      className="border px-2 py-1 w-20 rounded"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleGradeSubmit(sub.submission_id, sub.grade || 0)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                    >
                      Submit Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
