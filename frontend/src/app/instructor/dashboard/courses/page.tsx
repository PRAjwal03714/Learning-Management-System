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
  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-courses`, {
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

  const filteredCourses = courses
    .filter((course) =>
      course.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((course) => {
      if (filterOption === 'published') return course.is_published === true;
      if (filterOption === 'unpublished') return course.is_published === false;
      return true;
    })
    .sort((a, b) => {
      if (filterOption === 'term-asc') return a.term.localeCompare(b.term);
      if (filterOption === 'term-desc') return b.term.localeCompare(a.term);
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">All Courses</h1>

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
          <option value="published">Published Only</option>
          <option value="unpublished">Unpublished Only</option>
          <option value="term-asc">Term A → Z</option>
          <option value="term-desc">Term Z → A</option>
        </select>
      </div>

      {/* 📋 Courses Table */}
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
          {filteredCourses.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                No courses found.
              </td>
            </tr>
          ) : (
            filteredCourses.map((course) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
