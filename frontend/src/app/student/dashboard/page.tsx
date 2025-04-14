'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaBook } from 'react-icons/fa';

interface Course {
  course_id: string;
  course_name: string;
  term: string;
  colorClass?: string;
}

const bgColors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500',
  'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
  'bg-indigo-500', 'bg-orange-500', 'bg-teal-500',
];

const getColorClass = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgColors.length;
  return bgColors[index];
};

export default function StudentDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchCourses(token);
    }
  }, [router]);

  const fetchCourses = async (token: string) => {
    try {
      const res = await axios.get('http://localhost:5001/api/courses/available', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coloredCourses = res.data.courses.map((course: Course) => ({
        ...course,
        colorClass: getColorClass(course.course_id),
      }));

      setCourses(coloredCourses);
    } catch (err) {
      console.error('Error fetching available courses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <FaBook className="text-3xl text-red-700" />
        <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.course_id}
            onClick={() => router.push(`/student/dashboard/courses/${course.course_id}`)}
            className="cursor-pointer bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div className={`h-28 ${course.colorClass}`}></div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">{course.course_name}</h2>
              <p className="text-sm text-gray-600">{course.term}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
