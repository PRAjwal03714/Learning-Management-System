'use client';

import { useRouter } from 'next/navigation';
import { FaUserGraduate, FaChalkboardTeacher, FaTools } from 'react-icons/fa';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center bg-[#7c0000] text-white px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Empower Learning with <span className="text-white">StudyMate</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl">
        Seamlessly manage courses, collaborate, and succeed—whether you&apos;re a student, instructor, or admin.
        </p>
      </section>

      {/* Cards Section */}
      <section className="flex-grow bg-white py-20 px-6 flex items-center justify-center">
  <div className="-mt-15  grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl w-full">
    {/* Student Card */}
    <div
      onClick={() => router.push('/signup')}
      className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 cursor-pointer border border-gray-300"
    >
      <FaUserGraduate className="text-blue-500 text-5xl mb-4" />
      <h3 className="text-2xl font-semibold mb-2">Student View</h3>
      <p className="text-gray-600">
        Access courses, submit assignments, and track your learning progress easily.
      </p>
    </div>

    {/* Instructor Card */}
    <div
      onClick={() => router.push('/instructor/signup')}
      className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 cursor-pointer border border-gray-300"
    >
      <FaChalkboardTeacher className="text-purple-500 text-5xl mb-4" />
      <h3 className="text-2xl font-semibold mb-2">Instructor Panel</h3>
      <p className="text-gray-600">
        Manage course content, view submissions, and communicate with students.
      </p>
    </div>

    {/* Admin Card */}
    <div
      onClick={() => router.push('/admin-login')}
      className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 cursor-pointer border border-gray-300"
    >
      <FaTools className="text-red-500 text-5xl mb-4" />
      <h3 className="text-2xl font-semibold mb-2">Admin Tools</h3>
      <p className="text-gray-600">
        Oversee the platform with user management, analytics, and system settings.
      </p>
    </div>
  </div>
</section>
    </div>
  );
}
