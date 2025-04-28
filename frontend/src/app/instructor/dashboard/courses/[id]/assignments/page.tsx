'use client';

import { useState, useEffect } from 'react';
import ViewAssignments from './ViewAssignments';
import CreateAssignment from './createAssignment';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

type Course = {
  name: string;
};

export default function AssignmentsPage() {
  const { id: courseId } = useParams();
  const [tab, setTab] = useState<'view' | 'create'>('view');
  const [course, setCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data.course);
      } catch {
        toast.error('Failed to fetch course info');
      }
    };

    fetchCourse();
  }, [courseId]);

  return (
    <div className="p-6 -mt-6">
      {course && (
        <div className="text-xl font-semibold mb-4">
          <span
            onClick={() => window.location.href = `/instructor/dashboard/courses/${courseId}`}
            className="text-blue-700 hover:underline cursor-pointer"
          >
            {course.name}
          </span>
          <span className="text-gray-400 mx-1">›</span>
          <span className="text-red-600">Assignments</span>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('view')}
          className={`px-4 py-2 rounded cursor-pointer ${tab === 'view' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          View Assignments
        </button>
        <button
          onClick={() => setTab('create')}
          className={`px-4 py-2 rounded cursor-pointer ${tab === 'create' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          Create Assignment
        </button>
      </div>

      {/* 🔍 Search and Filter visible only for view */}
      {tab === 'view' && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignments</option>
            <option value="published">Published Only</option>
            <option value="unpublished">Unpublished Only</option>
            <option value="due-newest">Newest Due Date</option>
            <option value="due-oldest">Oldest Due Date</option>
          </select>
        </div>
      )}

      {tab === 'view' ? (
        <ViewAssignments courseId={courseId as string} search={search} filterOption={filterOption} />
      ) : (
        <CreateAssignment courseId={courseId as string} />
      )}
    </div>
  );
}
