'use client';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type Course = {
  id: string;
  name: string;
  term: string;
};

export default function CourseDrawer({ onClose }: { onClose: () => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch('http://localhost:5001/api/courses/my-courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) setCourses(data.courses);
    };

    fetchCourses();
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose(); // Close drawer after navigating
  };

  return (
    <div className="w-64 h-full bg-white shadow-lg border-l overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-bold text-lg">Courses</h2>
        <button onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <nav className="flex flex-col p-4 space-y-3">
        <button
          onClick={() => handleNavigate('/instructor/dashboard/courses')}
          className="text-blue-600 hover:underline text-left"
        >
          All Courses
        </button>
        <button
          onClick={() => handleNavigate('/instructor/dashboard/courses/create')}
          className="text-blue-600 hover:underline text-left"
        >
          Create Course
        </button>

        <hr className="my-2" />
        <h3 className="font-semibold text-sm text-gray-600">My Courses</h3>
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => handleNavigate(`/instructor/dashboard/courses/${course.id}`)}
            className="text-sm text-gray-800 hover:text-blue-600 text-left"
          >
            <div className="flex flex-col">
              <span className="font-medium">{course.name}</span>
              <span className="text-xs text-gray-500">{course.term}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
