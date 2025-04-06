// app/instructor/dashboard/courses/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Course = {
  id: string;
  name: string;
  department: string;
  number: string;
  term: string;
  credits: number;
  start_date: string;
  end_date: string;
  is_published: boolean;
  is_active: boolean;
};

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await fetch(`http://localhost:5001/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      if (res.ok) setCourse(data.course);
    };

    fetchCourse();
  }, [id]);

  if (!course) return <div className="text-center mt-20 text-gray-500">Loading course...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <p><strong>Department:</strong> {course.department}</p>
        <p><strong>Course Number:</strong> {course.number}</p>
        <p><strong>Term:</strong> {course.term}</p>
        <p><strong>Credits:</strong> {course.credits}</p>
        <p><strong>Start Date:</strong> {new Date(course.start_date).toDateString()}</p>
        <p><strong>End Date:</strong> {new Date(course.end_date).toDateString()}</p>
        <p><strong>Status:</strong> {course.is_published ? 'Published' : 'Unpublished'} | {course.is_active ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  );
}
