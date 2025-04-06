'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideTopNav = pathname.startsWith('/instructor/dashboard') || pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-b from-white to-blue-200">
      
      {!hideTopNav && (
        
        <div className="bg-gradient-to-r from-blue-800 via-purple-500 to-pink-400 w-full h-20 shadow-2xl flex items-center justify-between px-6">
            

          <Link href="/">
            <span className="text-3xl text-white font-bold cursor-pointer hover:opacity-90">
              StudyMate
            </span>
          </Link>

          <div className="flex gap-4">
          <Link href="/">
              <button className="bg-white text-blue-700 font-semibold px-4 py-1.5 rounded hover:bg-blue-100 transition cursor-pointer">
                Home
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-white text-blue-700 font-semibold px-4 py-1.5 rounded hover:bg-blue-100 transition cursor-pointer">
                Student
              </button>
            </Link>
            <Link href="/instructor/signup">
              <button className="bg-white text-purple-700 font-semibold px-4 py-1.5 rounded hover:bg-purple-100 transition cursor-pointer">
                Instructor
              </button>
            </Link>
            <Link href="/admin-login">
              <button className="bg-white text-red-700 font-semibold px-4 py-1.5 rounded hover:bg-red-100 transition cursor-pointer">
                Admin
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
