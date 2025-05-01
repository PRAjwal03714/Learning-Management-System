'use client';

import Link from 'next/link';
import { FaSignOutAlt } from 'react-icons/fa';
import AdminSidebar from '@/components/AdminSidebar';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
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
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-gray-200 shadow-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#7c0000] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
            AD
          </div>
          <Link href="/admin/dashboard" className="text-3xl font-extrabold text-[#7c0000] tracking-tight">
            Admin Panel
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
      <AdminSidebar />

      {/* Main Content */}
      <main className="ml-56 mt-20 p-6 w-full h-[calc(100vh-5rem)] overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}
