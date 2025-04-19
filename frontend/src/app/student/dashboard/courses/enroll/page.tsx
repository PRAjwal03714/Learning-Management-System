'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Course = {
  course_id: string;
  course_name: string;
  number: string;
  term: string;
  department: string;
  start_date: string;
  end_date: string;
  instructor_name: string;
  credits: number;
};

export default function EnrollCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [enrolledCredits, setEnrolledCredits] = useState<number>(0);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      fetchCourses();
      fetchRegisteredCourses();
    }
  }, [token]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/courses/available', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedCourses: Course[] = res.data.courses.map((c: any) => ({
        ...c,
        credits: Number(c.credits) || 0,
      }));
      setCourses(fetchedCourses);
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
    }
  };

  const fetchRegisteredCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/courses/my-registered-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = new Set<string>();
      let total = 0;

      for (const course of res.data.courses) {
        ids.add(course.course_id);
        const c = Number(course.credits);
        if (!isNaN(c)) total += c;
      }

      setRegisteredIds(ids);
      setEnrolledCredits(total);
    } catch (err) {
      console.error('❌ Error fetching registered courses:', err);
    }
  };

  const handleRegister = async (course: Course) => {
    try {
      await axios.post(
        'http://localhost:5001/api/courses/enroll',
        { course_id: course.course_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = new Set(registeredIds);
      updated.add(course.course_id);
      setRegisteredIds(updated);
      setEnrolledCredits((prev) => prev + course.credits);
    } catch (err) {
      console.error('❌ Register error:', err);
    }
  };

  const handleUnregister = async (course: Course) => {
    try {
      await axios.post(
        'http://localhost:5001/api/courses/unenroll',
        { course_id: course.course_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = new Set(registeredIds);
      updated.delete(course.course_id);
      setRegisteredIds(updated);
      setEnrolledCredits((prev) => prev - course.credits);
    } catch (err) {
      console.error('❌ Unregister error:', err);
    }
  };

  return (
    <div className="-mt-1">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Enroll in Courses</h1>
        <span className="text-lg font-semibold text-gray-700">
          Enrolled Credits: {enrolledCredits} (max 12)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Course Name</th>
              <th className="px-4 py-2 text-left">Term</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Instructor</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
              <th className="px-4 py-2 text-left">Credits</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No courses available.
                </td>
              </tr>
            ) : (
              courses.map((course) => {
                const isRegistered = registeredIds.has(course.course_id);
                const limitReached = enrolledCredits + course.credits > 12;

                return (
                  <tr key={course.course_id} className="border-t">
                    <td className="px-4 py-2">
                    <Link href={`/student/dashboard/courses/details/${course.course_id}`}

                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {course.course_name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{course.term}</td>
                    <td className="px-4 py-2">{course.department}</td>
                    <td className="px-4 py-2">{course.instructor_name}</td>
                    <td className="px-4 py-2">{new Date(course.start_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(course.end_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{course.credits}</td>
                    <td className="px-4 py-2 flex gap-2 justify-center">
                      <button
                        onClick={() => handleRegister(course)}
                        disabled={isRegistered || limitReached}
                        className={`px-3 py-1 rounded text-white ${isRegistered || limitReached
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                          }`}
                      >
                        Register
                      </button>
                      <button
                        onClick={() => handleUnregister(course)}
                        disabled={!isRegistered}
                        className={`px-3 py-1 rounded text-white ${!isRegistered
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#7c0000] hover:bg-[#7c0000] cursor-pointer'
                          }`}
                      >
                        Unregister
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
