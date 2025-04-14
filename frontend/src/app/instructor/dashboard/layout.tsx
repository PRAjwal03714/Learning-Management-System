'use client';
import Link from 'next/link'; // Make sure this is at the top

import InstructorSidebar from '@/components/InstructorsSidebar';
import CourseDrawer from '@/components/CourseDrawer';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import { FaSignOutAlt } from 'react-icons/fa';


export default function InstructorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainLayout>{children}</MainLayout>
    </SidebarProvider>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const { showCourseDrawer, closeCourseDrawer } = useSidebar();

  const handleLogout = () => {
    localStorage.clear(); // Clear token/session if needed
    window.location.href = '/'; // Redirect to login/home
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-gray-200 shadow-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
            SM
          </div>
          <Link href="/instructor/dashboard" className="text-3xl font-extrabold text-red-700 tracking-tight">
  StudyMate
</Link>        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </header>

      {/* Sidebar */}
      <InstructorSidebar />

      {/* Course Drawer */}
      {showCourseDrawer && (
        <div className="fixed top-20 left-56 w-64 h-[calc(100vh-5rem)] z-50">
          <CourseDrawer onClose={closeCourseDrawer} />
        </div>
      )}

      {/* Main Content */}
      <main className="ml-56 mt-20 p-6 w-full h-[calc(100vh-5rem)] overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}
