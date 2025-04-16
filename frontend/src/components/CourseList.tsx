'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Course = {
  id: string;
  name: string;
  term: string;
};

interface CourseListProps {
  refresh: boolean;
}

export default function CourseList({ refresh }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token=localStorage.getItem('token')
        const res = await fetch('http://localhost:5001/api/courses/my-courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setCourses(data.courses);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };

    fetchCourses();
  }, [refresh]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: Course) => (
          <div
            key={course.id}
            className="p-4 bg-white rounded shadow border border-gray-200 hover:bg-gray-50 cursor-pointer"
            onClick={() => router.push(`/instructor/dashboard/courses/${course.id}`)}
          >
            <h3 className="font-bold text-lg">{course.name}</h3>
            <p className="text-sm text-gray-600">{course.term}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
