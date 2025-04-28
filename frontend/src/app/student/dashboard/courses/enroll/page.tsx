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
  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('all');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      fetchCourses();
      fetchRegisteredCourses();
    }
  }, [token]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/available`, {
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-registered-courses`, {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/enroll`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/unenroll`,
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

  const filteredCourses = courses
    .filter((course) =>
      course.course_name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filterOption === 'credits-high') return b.credits - a.credits;
      if (filterOption === 'credits-low') return a.credits - b.credits;
      if (filterOption === 'term-asc') return a.term.localeCompare(b.term);
      if (filterOption === 'term-desc') return b.term.localeCompare(a.term);
      return 0;
    });

  return (
    <div className="-mt-1">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Enroll in Courses</h1>
        <span className="text-lg font-semibold text-gray-700">
          Enrolled Credits: {enrolledCredits} (max 12)
        </span>
      </div>

      {/* 🔍 Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Courses</option>
          <option value="credits-high">Credits High → Low</option>
          <option value="credits-low">Credits Low → High</option>
          <option value="term-asc">Term A → Z</option>
          <option value="term-desc">Term Z → A</option>
        </select>
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
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No courses available.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => {
                const isRegistered = registeredIds.has(course.course_id);
                const limitReached = enrolledCredits + course.credits > 12;

                return (
                  <tr key={course.course_id} className="border-t">
                    <td className="px-4 py-2">
                      <Link
                        href={`/student/dashboard/courses/details/${course.course_id}`}
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
