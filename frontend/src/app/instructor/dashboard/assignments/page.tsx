'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaClipboardList } from 'react-icons/fa';

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  course_title: string;
}

export default function AllInstructorAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data.assignments);
      } catch (err) {
        toast.error('Failed to fetch assignments');
      }
    };

    fetchAssignments();
  }, []);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase()) ||
    a.course_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 -mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaClipboardList className="text-blue-700" /> All Course Assignments
      </h1>

      <input
        type="text"
        placeholder="Search assignments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-4 px-4 py-2 border rounded shadow-sm"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500 italic">No assignments found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.id} className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaClipboardList className="text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{a.title}</h2>
                    <p className="text-sm text-gray-500">{a.course_title}</p>
                  </div>
                </div>
                <div className="font-bold text-sm text-gray-500 text-right min-w-fit">
                  Due: <br />
                  {new Date(a.due_date).toLocaleString()}
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-2 line-clamp-3">{a.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
