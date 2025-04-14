'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { AxiosError } from 'axios';

interface Course {
  course_id: string;
  course_name: string;
  number: string;
  term: string;
  department: string;
  start_date: string;
  end_date: string;
  instructor_name: string;
}

export default function EnrollCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<string[]>([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      fetchCourses();
      fetchRegisteredCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/courses/available', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses);
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
    }
  };
  
  const fetchRegisteredCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/courses/my-registered-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegisteredCourses(res.data.registered);
    } catch (err) {
        const error = err as AxiosError;
        console.error("❌ Error fetching registered courses:", error.response?.data || error.message);
      }
  };
  

  const handleRegister = async (course_id: string) => {
    await axios.post(
      'http://localhost:5001/api/courses/enroll',
      { course_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRegisteredCourses([...registeredCourses, course_id]);
  };

  const handleUnregister = async (course_id: string) => {
    await axios.post(
      'http://localhost:5001/api/courses/unenroll',
      { course_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRegisteredCourses(registeredCourses.filter(id => id !== course_id));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Enroll in Courses</h1>
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
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const isRegistered = registeredCourses.includes(course.course_id);
              return (
                <tr key={course.course_id} className="border-t">
                  <td className="px-4 py-2">{course.course_name}</td>
                  <td className="px-4 py-2">{course.term}</td>
                  <td className="px-4 py-2">{course.department}</td>
                  <td className="px-4 py-2">{course.instructor_name}</td>
                  <td className="px-4 py-2">
  {new Date(course.start_date).toLocaleDateString()}
</td>
<td className="px-4 py-2">
  {new Date(course.end_date).toLocaleDateString()}
</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      disabled={isRegistered}
                      onClick={() => handleRegister(course.course_id)}
                      className={`px-3 py-1 rounded text-white ${
                        isRegistered ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      Register
                    </button>
                    <button
                      disabled={!isRegistered}
                      onClick={() => handleUnregister(course.course_id)}
                      className={`px-3 py-1 rounded text-white ${
                        !isRegistered ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      Unregister
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
