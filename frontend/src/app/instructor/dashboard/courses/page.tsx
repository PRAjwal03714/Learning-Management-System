'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Course = {
  id: string;
  name: string;
  term: string;
  is_published: boolean;
};

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');


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

  const navigateToCourse = (id: string) => {
    router.push(`/instructor/dashboard/courses/${id}`);
  };

  return (
    <div className=" max-w-6xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">All Courses</h1>

      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100 text-sm text-left text-gray-600">
          <tr>
            <th className="py-2 px-4">Course</th>
            <th className="py-2 px-4">Term</th>
            <th className="py-2 px-4">Created As</th>
            <th className="py-2 px-4">Published</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr
              key={course.id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => navigateToCourse(course.id)}
            >
              <td className="py-2 px-4 font-medium text-blue-700">{course.name}</td>
              <td className="py-2 px-4">{course.term}</td>
              <td className="py-2 px-4">Instructor</td>
              <td className="py-2 px-4">{course.is_published ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
