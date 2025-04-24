// app/instructor/dashboard/courses/[id]/assignments/[assignmentId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface Assignment {
  id: string;
  title: string;
  instructions: string;
  due_date: string;
  points: number;
  submitting_type: string;
  file_url?: string;
}

export default function AssignmentDetailsPage() {
  const { id: courseId, assignmentId } = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${assignmentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAssignment(res.data.assignment);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  if (!assignment) return <div className="p-6 text-gray-600">Loading assignment...</div>;

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{assignment.title}</h1>
        <div className="flex gap-2">
          <span className="bg-green-600 text-white text-sm px-3 py-1 rounded">✔️ Published</span>
          <button
            className="border border-gray-400 px-3 py-1 rounded hover:bg-gray-100 text-sm"
            onClick={() => router.push(`/instructor/dashboard/courses/${courseId}/assignments/${assignmentId}/edit`)}
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      <div className="border p-4 rounded mb-6 text-sm text-gray-700 whitespace-pre-wrap">
        {assignment.instructions}
        {assignment.file_url && (
          <div className="mt-2">
            <a href={assignment.file_url} target="_blank" className="text-blue-600 underline">Download Attachment</a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
        <p><strong>Points:</strong> {assignment.points}</p>
        <p><strong>Submitting:</strong> {assignment.submitting_type}</p>
      </div>

      <table className="w-full text-sm border-t">
        <thead className="text-left">
          <tr className="border-b">
            <th className="p-2">Due</th>
            <th className="p-2">For</th>
            <th className="p-2">Available From</th>
            <th className="p-2">Until</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">{new Date(assignment.due_date).toDateString()}</td>
            <td className="p-2">Everyone</td>
            <td className="p-2">-</td>
            <td className="p-2">-</td>
          </tr>
        </tbody>
      </table>

      <button className="mt-6 px-4 py-2 border text-sm rounded hover:bg-gray-100">➕ Rubric</button>
    </div>
  );
}
