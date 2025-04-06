'use client';
import InstructorSidebar from '@/components/InstructorsSidebar';
import CourseDrawer from '@/components/CourseDrawer';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

export default function InstructorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainLayout>{children}</MainLayout>
    </SidebarProvider>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const { showCourseDrawer, closeCourseDrawer } = useSidebar();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <header className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-800 via-purple-500 to-pink-400 shadow-md z-50 flex items-center px-6 text-white font-bold text-3xl">
        StudyMate
      </header>

      <InstructorSidebar />

      {showCourseDrawer && (
        <div className="fixed top-20 left-56 w-64 h-[calc(100vh-5rem)] z-50">
          <CourseDrawer onClose={closeCourseDrawer} />
        </div>
      )}

      <main className="ml-56 mt-20 p-6 w-full h-[calc(100vh-5rem)] overflow-y-auto bg-gradient-to-b from-white to-blue-200">
        {children}
      </main>
    </div>
  );
}
