'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Course = {
  course_id: string;
  course_name: string;
  term: string;
  department: string;
  instructor_name: string;
};

export default function StudentAllCoursesPage() {
    const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/courses/my-registered-courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.courses);
      } catch (error) {
        console.error('❌ Error fetching registered courses:', error);
      }
    };

    if (token) fetchCourses();
  }, [token]);

  return (
    <div className="-mt-2">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Course</th>
              <th className="px-4 py-2 text-left">Term</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Instructor</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No registered courses.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.course_id} className="border-t">
                  <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                  <button
                  className="text-blue-600 cursor-pointer  hover:text-blue-800"
                  onClick={() => router.push(`/student/dashboard/courses/${course.course_id}`)}
                >
                    {course.course_name}
                    </button>

                  </td>
                  <td className="px-4 py-2">{course.term}</td>
                  <td className="px-4 py-2">{course.department}</td>
                  <td className="px-4 py-2">{course.instructor_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
