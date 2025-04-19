'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  // Fix hydration mismatch by deferring until after mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const hideTopNav =
  pathname.startsWith('/instructor/dashboard') || pathname.startsWith('/student/dashboard');

  const centerVertically =
    pathname === '/signup' ||
    pathname === '/login' ||
    pathname === '/instructor/signup' ||
    pathname === '/instructor/login' ||
    pathname === '/admin-login';

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-b bg-white">
      {!hideTopNav && (
        <div className="w-full bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50">
          {/* Left: Logo and Name */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#7c0000] text-white rounded-full w-9 h-9 flex items-center justify-center text-sm font-bold">
              SM
            </div>
            <span className="text-3xl font-extrabold text-[#7c0000] tracking-tight">
              StudyMate
            </span>

          </Link>

          {/* Right: Nav Links */}
          <div className="flex items-center gap-8 text-lg font-bold text-[#7c0000]">
            <Link
              href="/"
              className={`hover:underline ${pathname === '/' ? 'underline' : ''}`}
            >
              Home
            </Link>
            <Link
              href="/signup"
              className={`hover:underline ${pathname === '/signup' || pathname === '/login' ? 'underline' : ''
                }`}
            >
              Student
            </Link>
            <Link
              href="/instructor/signup"
              className={`hover:underline ${pathname === '/instructor/signup' || pathname === '/instructor/login'
                  ? 'underline'
                  : ''
                }`}
            >
              Instructor
            </Link>
            <Link
              href="/admin-login"
              className={`hover:underline ${pathname === '/admin-login' ? 'underline' : ''}`}
            >
              Admin
            </Link>
          </div>
        </div>

      )}

      {/* Page Content */}
      <main
        className={`flex-1 w-full ${centerVertically ? 'flex items-center justify-center' : ''}`}
      >
        {children}
      </main>
    </div>
  );
}
