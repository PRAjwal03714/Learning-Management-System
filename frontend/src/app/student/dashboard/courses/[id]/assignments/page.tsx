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
  comment?: string;
  marks?: number;
  files: AssignmentFile[];
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
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('all');


  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [courseRes, assignmentsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/published/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCourse(courseRes.data.course);
      setAssignments(assignmentsRes.data.assignments || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load course or assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  // const filtered = assignments.filter((a) =>
  //   a.title.toLowerCase().includes(search.toLowerCase()) ||
  //   a.description.toLowerCase().includes(search.toLowerCase())
  // );
  const filtered = assignments
  .filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  )
  .filter((a) => {
    if (filterOption === 'has-files') return a.files && a.files.length > 0;
    if (filterOption === 'has-comments') return a.comment && a.comment.trim() !== '';
    return true;
  })
  .sort((a, b) => {
    if (filterOption === 'due-soon') return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    if (filterOption === 'due-late') return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
    if (filterOption === 'marks-high') return (b.marks ?? 0) - (a.marks ?? 0);
    if (filterOption === 'marks-low') return (a.marks ?? 0) - (b.marks ?? 0);
    return 0;
  });


  const handleCardClick = (assignmentId: string) => {
    router.push(`/student/dashboard/courses/${courseId}/assignments/${assignmentId}`);
  };

  if (loading) {
    return <div className="text-gray-600">Loading assignments...</div>;
  }

  return (
    <div className="mt-1">
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
      <select
    value={filterOption}
    onChange={(e) => setFilterOption(e.target.value)}
    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="all">All Assignments</option>
    <option value="due-soon">Due Date (Soonest First)</option>
    <option value="due-late">Due Date (Latest First)</option>
    <option value="marks-high">Marks (Highest First)</option>
    <option value="marks-low">Marks (Lowest First)</option>
    <option value="has-files">Has Attached Files</option>
    <option value="has-comments">Has Comments</option>
  </select>

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
              <div>
                <h3 className="text-xl font-bold text-gray-900">{a.title}</h3>
                <p className="text-gray-700 mt-1">{a.description}</p>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p><span className="font-semibold text-gray-800">Due:</span> {new Date(a.due_date).toDateString()}</p>
                  {a.comment && (
                    <p><span className="font-semibold text-gray-800">Comments:</span> {a.comment}</p>
                  )}
                  {typeof a.marks === 'number' && (
                    <p><span className="font-semibold text-gray-800">Marks:</span> {a.marks}</p>
                  )}
                </div>

                {/* 📎 Attached Files */}
                {a.files && a.files.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {a.files.map((file) => (
                      <a
                        key={file.id}
                        // href={`${process.env.NEXT_PUBLIC_API_URL}${file.url}`}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} // prevent card click
                        className="block text-sm text-blue-600 hover:underline"
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
