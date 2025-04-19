'use client';

import Link from 'next/link';
import { FaSignOutAlt } from 'react-icons/fa';
import StudentSidebar from '@/components/StudentSidebar'; // make sure you create this
import StudentCourseDrawer from '@/components/StudentCourseDrawer';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';


export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainLayout>{children}</MainLayout>
    </SidebarProvider>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const { showCourseDrawer, closeCourseDrawer } = useSidebar();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-gray-200 shadow-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#7c0000] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">SM</div>
          <Link href="/student/dashboard" className="text-3xl font-extrabold text-[#7c0000] tracking-tight">
            StudyMate
          </Link>
        </div>

        <button
  onClick={handleLogout}
  className="p-3 bg-[#7c0000] text-white rounded-full shadow-md hover:bg-red-700 hover:scale-110 transition-all duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300"
  title="Logout"
>
  <FaSignOutAlt className="text-xl" />
</button>

      </header>

      {/* Sidebar */}
{/* Sidebar */}
<StudentSidebar />

{/* Course Drawer */}
{showCourseDrawer && (
  <div className="fixed top-20 left-56 w-64 h-[calc(100vh-5rem)] z-50">
    <StudentCourseDrawer onClose={closeCourseDrawer} />
  </div>
)}

      {/* Main Content */}
      <main className="ml-56 mt-20 p-6 w-full h-[calc(100vh-5rem)] overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}
