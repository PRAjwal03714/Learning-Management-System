'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaClipboardList } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface AssignmentFile {
  id: string;
  name: string;
  url: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  files: AssignmentFile[];
}

interface Course {
  name: string;
}

export default function StudentAssignmentsPage() {
  const { id } = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data.course);
      } catch {
        toast.error('Failed to fetch course info');
      }
    };

    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/assignments/by-course/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data.assignments || []);
      } catch {
        toast.error('Failed to fetch assignments');
      }
    };

    fetchCourse();
    fetchAssignments();
  }, [id]);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* 🔷 Breadcrumb Header */}
      <div className="text-xl font-semibold text-blue-700 mb-2">
        <span
          onClick={() => (window.location.href = `/student/dashboard/courses/${id}`)}
          className="cursor-pointer hover:underline"
        >
          {course?.name || 'Course'}
        </span>
        <span className="text-gray-400"> › </span>
        <span className="text-red-600">Assignments</span>
      </div>

      {/* 📋 Page Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaClipboardList className="text-indigo-600" /> Assignments
      </h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search assignments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* 📌 Assignment List */}
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
                    <h3 className="text-lg font-semibold text-gray-800">{a.title}</h3>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(a.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-2 line-clamp-3">{a.description}</p>

              {a.files?.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-sm text-gray-800 mb-1">Files:</p>
                  <ul className="list-disc list-inside text-sm">
                    {a.files.map((file) => (
                      <li key={file.id}>
                        <a
                          href={`http://localhost:5001${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
