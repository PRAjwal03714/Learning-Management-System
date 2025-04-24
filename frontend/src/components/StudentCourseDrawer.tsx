'use client';

import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type Course = {
  course_id: string;
  course_name: string;
  term: string;
};

export default function StudentCourseDrawer({ onClose }: { onClose: () => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMyCourses = async () => {
      const token=localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-registered-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      if (res.ok && data.courses) {
        setCourses(data.courses); // ✅ expect "courses" key
      }
    };
  
    fetchMyCourses();
  }, []);
  

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
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
          onClick={() => handleNavigate('/student/dashboard/courses')}
          className=" text-md text-[#7c0000] hover:underline text-left cursor-pointer"
        >
          All Courses
        </button>
        <button
          onClick={() => handleNavigate('/student/dashboard/courses/enroll')}
          className="text-md text-[#7c0000] hover:underline text-left cursor-pointer"
        >
          Enroll in Course
        </button>

        <hr className="my-2" />
        <h3 className="font-bold text-lg text-black-600">My Courses</h3>
        
        {Array.isArray(courses) && courses.length > 0 ? (
          courses.map((course) => (
            <button
              key={course.course_id}
              onClick={() => handleNavigate(`/student/dashboard/courses/${course.course_id}`)}
              className="text-md text-[#7c0000] hover:underline text-left cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">{course.course_name}</span>
                <span className="text-xs text-gray-500">{course.term}</span>
              </div>
            </button>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No courses registered yet.</p>
        )}
      </nav>
    </div>
  );
}
