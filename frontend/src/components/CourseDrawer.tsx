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
      const token=localStorage.getItem('token')
      const res = await fetch('http://localhost:5001/api/courses/my-courses', {
        headers: {
          Authorization: `Bearer ${token}`,
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
    <div className="w-64 h-full bg-white shadow-lg border-t border-r border-black overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-bold text-lg">Courses</h2>
        <button onClick={onClose} className="cursor-pointer">
          <FaTimes />
        </button>
      </div>

      <nav className="flex flex-col p-4 space-y-3">
        <button
          onClick={() => handleNavigate('/instructor/dashboard/courses')}
          className="text-base text-[#7c0000] hover:underline text-left cursor-pointer"
        >
          All Courses
        </button>
        <button
          onClick={() => handleNavigate('/instructor/dashboard/courses/create')}
          className="text-[#7c0000] hover:underline text-left cursor-pointer"
        >
          Create Course
        </button>

        <hr className="my-2" />
        <h3 className="font-bold text-lg text-black-600">My Courses</h3>
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => handleNavigate(`/instructor/dashboard/courses/${course.id}`)}
            className="text-md text-[#7c0000] hover:underline text-left cursor-pointer"
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
