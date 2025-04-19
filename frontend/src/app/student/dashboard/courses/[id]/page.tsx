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

export default function CourseHomePage() {
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
<div className="mx-auto max-w-5xl bg-white -mt-3 p-6 rounded shadow leading-relaxed">
<h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        {course.term.toUpperCase()}-BL-{course.department.toUpperCase()}-{course.number} • {course.name.toUpperCase()}
      </h1>

      <p>
        Welcome to <strong>{course.name}</strong> ({course.department.toUpperCase()}-{course.number})! This course introduces you to the world of software engineering and covers a semester-long project. You&apos;ll explore software development methodologies, design principles, quality assurance, and implementation strategies.
      </p>

      <p className="mt-4 text-sm italic text-gray-600">
        <strong>Note:</strong> This course is a &quot;work in progress&quot; and this page may be updated frequently.
      </p>

      <hr className="my-6" />

      <div className="space-y-3 text-sm text-gray-800">
        <p>
          📘 <strong>Syllabus:</strong>{' '}
          <a href="#" className="text-blue-600 underline cursor-pointer">View syllabus</a> for course expectations, textbook info, and weekly topics.
        </p>
        <p>
          ✨ <strong>Start here:</strong>{' '}
          <a href="#" className="text-yellow-600 font-semibold underline">Weekly Learning Modules</a> (assignments, lectures, quizzes).
        </p>
        <p>
          📂 <strong>Project resources:</strong>{' '}
          <a href="#" className="text-green-700 underline">View templates and deadlines</a> for team submissions.
        </p>
      </div>

      <hr className="my-6" />

      <div className="text-sm">
        <h2 className="font-bold mb-2">📋 Course Logistics</h2>
        <ul className="list-disc ml-5 space-y-2">
          <li>
            <a href="#" className="text-blue-600 underline">Associate Instructors & Contact Info</a>
          </li>
          <li>
            <a href="#" className="text-purple-700 underline">Grading Policy</a> and assignment breakdown
          </li>
        </ul>
      </div>

      <hr className="my-6" />

      <div className="text-sm italic text-gray-600">
        <p>
          💡 <strong>Format:</strong> Hybrid Online / Asynchronous. Some meetings are live via Zoom, others are asynchronous.
        </p>
        <p>
          Videos, quizzes, and modules will be posted weekly. You&apos;re encouraged to stay up-to-date and reach out if you have questions.
        </p>
      </div>

      <hr className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <p><strong>Term:</strong> {course.term}</p>
        <p><strong>Credits:</strong> {course.credits}</p>
        <p><strong>Start Date:</strong> {new Date(course.start_date).toDateString()}</p>
        <p><strong>End Date:</strong> {new Date(course.end_date).toDateString()}</p>
        <p><strong>Status:</strong> {course.is_published ? 'Published' : 'Unpublished'} | {course.is_active ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  );
}
