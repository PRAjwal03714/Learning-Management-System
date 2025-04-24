'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaBook } from 'react-icons/fa';

interface Course {
  id: string;
  name: string;
  term: string;
  color?: string;
}

// IU-style consistent solid colors
const colorPalette = [
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

// Stable hash to pick a color from palette
const getColor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

export default function InstructorDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/instructor/login');
    } else {
      fetchCourses(token);
    }
  }, [router]);

  const fetchCourses = async (token: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coloredCourses = res.data.courses.map((course: Course) => ({
        ...course,
        color: getColor(course.id),
      }));

      setCourses(coloredCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className=" -mt-3">
      <div className="flex items-center gap-3 mb-6">
        <FaBook className="text-3xl text-[#7c0000]" />
        <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => router.push(`/instructor/dashboard/courses/${course.id}`)}
            className="cursor-pointer bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div
              className="h-28 w-full"
              style={{ backgroundColor: course.color }}
            ></div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">{course.name}</h2>
              <p className="text-sm text-gray-600">{course.term}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
