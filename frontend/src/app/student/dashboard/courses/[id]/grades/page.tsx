'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface AssignmentGrade {
  assignment_id: string;
  assignment_title: string;
  due_date: string;
  submitted_at: string;
  marks_scored: number;
  total_marks: number;
}

interface Course {
  course_id: string;
  course_name: string;
}

const arrangeOptions = [
  { label: 'Due Date', value: 'due_date' },
  { label: 'Assignment Group', value: 'assignment_group' },
  { label: 'Module', value: 'module' },
  { label: 'Name', value: 'name' },
];

export default function StudentGradesPage() {
  const { id: courseIdFromParams } = useParams<{ id: string }>();
  const [assignments, setAssignments] = useState<AssignmentGrade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [arrangeBy, setArrangeBy] = useState<string>('due_date');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchGrades(selectedCourseId);
    }
  }, [selectedCourseId, arrangeBy]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/courses/my-registered-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedCourses: Course[] = res.data.courses;
      setCourses(fetchedCourses);

      if (fetchedCourses.length > 0) {
        const match = fetchedCourses.find((course) => course.course_id === courseIdFromParams);
        if (match) {
          setSelectedCourseId(match.course_id);
        } else {
          setSelectedCourseId(fetchedCourses[0].course_id);
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchGrades = async (courseId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/assignments/student/grades/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let grades = res.data.grades;

      if (arrangeBy === 'due_date') {
        grades.sort((a: AssignmentGrade, b: AssignmentGrade) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
      } else if (arrangeBy === 'name') {
        grades.sort((a: AssignmentGrade, b: AssignmentGrade) => a.assignment_title.localeCompare(b.assignment_title));
      }

      setAssignments(grades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  return (
    <div className="mt-1">
      <h1 className="text-3xl font-bold mb-6">Grades</h1>

      <div className="flex gap-4 mb-6">
        {/* Course Selection */}
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="border px-4 py-2 rounded cursor-pointer"
        >
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name}
            </option>
          ))}
        </select>

        {/* Arrange By Selection */}
        <select
          value={arrangeBy}
          onChange={(e) => setArrangeBy(e.target.value)}
          className="border px-4 py-2 rounded cursor-pointer"
        >
          {arrangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {/* Grades Table */}
      {assignments.length === 0 ? (
        <p className="text-gray-500">No grades available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Due</th>
                <th className="px-4 py-2">Submitted</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.assignment_id} className="border-b">
                  <td className="px-4 py-2">
                    <Link
                      href={`/student/dashboard/courses/${selectedCourseId}/assignments/${assignment.assignment_id}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {assignment.assignment_title}
                    </Link>
                    <div className="text-sm text-gray-500">Assignment</div>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(assignment.due_date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {assignment.submitted_at ? new Date(assignment.submitted_at).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-2">
                    {assignment.marks_scored !== null ? (
                      <>{assignment.marks_scored} / {assignment.total_marks}</>
                    ) : (
                      <>/ {assignment.total_marks}</>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
