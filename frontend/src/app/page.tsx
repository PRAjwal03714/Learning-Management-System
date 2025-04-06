'use client';
import { useRouter } from 'next/navigation';
import { FaUserGraduate, FaChalkboardTeacher, FaTools } from 'react-icons/fa';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="text-center py-16 px-4">
      {/* Hero Section */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Welcome to <span className="text-blue-600">StudyMate</span>
      </h1>
      <p className="text-gray-600 max-w-xl mx-auto text-lg">
        A smart learning management system for students, instructors, and administrators.
      </p>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Student */}
        <div
          onClick={() => router.push('/signup')}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md transform hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer"
          >
          <FaUserGraduate className="text-blue-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Student View</h3>
          <p className="text-gray-600 text-sm">
            Access courses, submit assignments, and track your learning progress easily.
          </p>
        </div>

        {/* Instructor */}
        <div
          onClick={() => router.push('/instructor/signup')}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
          <FaChalkboardTeacher className="text-purple-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Instructor Panel</h3>
          <p className="text-gray-600 text-sm">
            Manage course content, view submissions, and communicate with students.
          </p>
        </div>

        {/* Admin */}
        <div
          onClick={() => router.push('/admin-login')}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
          <FaTools className="text-red-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Admin Tools</h3>
          <p className="text-gray-600 text-sm">
            Oversee the platform with user management, analytics, and system settings.
          </p>
        </div>
      </div>
    </div>
  );
}
