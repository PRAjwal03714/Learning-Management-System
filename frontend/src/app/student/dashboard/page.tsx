'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaBook } from 'react-icons/fa';

interface Course {
  course_id: string;
  course_name: string;
  term: string;
  color?: string;
}

// IU-style solid color palette
const bgPalette = [
  '#7B1C1C', // IU Crimson
  '#264653', // Deep Teal
  '#2A9D8F', // Turquoise
  '#E76F51', // Coral Red
  '#F4A261', // Sand
  '#8A5CF6', // Indigo
  '#457B9D', // Sky Blue
  '#A72608', // Brick
  '#4A4E69', // Slate
];

// Deterministic hash to select a color
const getColor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgPalette[Math.abs(hash) % bgPalette.length];
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
      const res = await axios.get('http://localhost:5001/api/courses/my-registered-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coloredCourses = res.data.courses.map((course: Course) => ({
        ...course,
        color: getColor(course.course_id),
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
    <div className="-mt-1">
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
            <div className="h-28 w-full" style={{ backgroundColor: course.color }}></div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {course.course_name}
              </h2>
              <p className="text-sm text-gray-600">{course.term}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
