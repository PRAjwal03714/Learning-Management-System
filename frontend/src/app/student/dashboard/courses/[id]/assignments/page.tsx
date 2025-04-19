'use client';

import { useParams, useRouter } from 'next/navigation';
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
  comment?: string;   // ✅ add comment
  marks?: number;     // ✅ add marks
}

interface Course {
  name: string;
}

export default function StudentAssignmentsPage() {
  const { id: courseId } = useParams();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data.course);
      } catch {
        toast.error('Failed to fetch course info');
      }
    };

    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/assignments/published/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data.assignments || []);
      } catch {
        toast.error('Failed to fetch assignments');
      }
    };
    

    fetchCourse();
    fetchAssignments();
  }, [courseId]);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardClick = (assignmentId: string) => {
    router.push(`/student/dashboard/courses/${courseId}/assignments/${assignmentId}`);
  };

  return (
    <div className="p-6 -mt-3">
      {/* 🔷 Breadcrumb Header */}
      <div className="text-xl font-semibold text-blue-700 mb-2">
        <span
          onClick={() => router.push(`/student/dashboard/courses/${courseId}`)}
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
            <div 
              key={a.id}
              onClick={() => handleCardClick(a.id)}
              className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:shadow-md hover:bg-indigo-50 transition"
            >
              {/* Assignment Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{a.title}</h3>
                <p className="text-gray-700 mt-1">{a.description}</p>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p><span className="font-semibold text-gray-800">Due:</span> {new Date(a.due_date).toDateString()}</p>
                  {a.comment && (
                    <p><span className="font-semibold text-gray-800">Comments:</span> {a.comment}</p>
                  )}
                  {a.marks !== undefined && (
                    <p><span className="font-semibold text-gray-800">Marks:</span> {a.marks}</p>
                  )}
                </div>

                {/* Attached Files */}
                {a.files?.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {a.files.map((file) => (
                      <a
                        key={file.id}
                        href={`http://localhost:5001${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm block"
                        onClick={(e) => e.stopPropagation()} // 🔥 Prevent card click
                      >
                        📎 {file.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
