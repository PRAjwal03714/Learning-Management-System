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
  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-registered-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.courses);
      } catch (error) {
        console.error('❌ Error fetching registered courses:', error);
      }
    };

    if (token) fetchCourses();
  }, [token]);

  const filteredCourses = courses
    .filter((course) =>
      course.course_name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((course) => {
      if (filterOption === 'all') return true;
      if (filterOption.startsWith('term:')) return course.term === filterOption.replace('term:', '');
      if (filterOption.startsWith('dept:')) return course.department === filterOption.replace('dept:', '');
      return true;
    });

  // Unique terms and departments for dropdown
  const uniqueTerms = Array.from(new Set(courses.map((c) => c.term)));
  const uniqueDepartments = Array.from(new Set(courses.map((c) => c.department)));

  return (
    <div className="-mt-2">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

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
          {/* 🔹 Filter by Term */}
          {uniqueTerms.map((term) => (
            <option key={term} value={`term:${term}`}>
              Term: {term}
            </option>
          ))}
          {/* 🔹 Filter by Department */}
          {uniqueDepartments.map((dept) => (
            <option key={dept} value={`dept:${dept}`}>
              Department: {dept.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 Courses Table */}
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
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No registered courses.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.course_id} className="border-t">
                  <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                    <button
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => router.push(`/student/dashboard/courses/${course.course_id}`)}
                    >
                      {course.course_name}
                    </button>
                  </td>
                  <td className="px-4 py-2">{course.term}</td>
                  <td className="px-4 py-2">{course.department.toUpperCase()}</td>
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
