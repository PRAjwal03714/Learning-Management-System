'use client';

import { useState, useEffect } from 'react';
import ViewAssignments from './ViewAssignments';
import CreateAssignment from './createAssignment';
import { useParams } from 'next/navigation';
import axios from 'axios';

type Course = {
  id: string;
  name: string;
  number: string;
  term: string;
  department: string;
};

export default function AssignmentsPage() {
  const [tab, setTab] = useState<'view' | 'create'>('view');
  const { id: courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCourse(res.data.course);
    } catch (err) {
      console.error('Failed to fetch course details', err);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      {course && (
        <h1 className="text-xl font-semibold mb-4">
          <span
            onClick={() =>
              window.location.href = `/instructor/dashboard/courses/${courseId}`
            }
            className="text-blue-700 font-bold hover:underline cursor-pointer"
          >
            {`${course.term}-BL-${course.department.toUpperCase()}-${course.number}`}
          </span>{' '}
          <span className="text-red-600">› Assignments</span>
        </h1>
      )}

      {/* Toggle Buttons */}
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

      {tab === 'view' ? (
        <ViewAssignments courseId={courseId as string} />
      ) : (
        <CreateAssignment courseId={courseId as string} />
      )}
    </div>
  );
}
