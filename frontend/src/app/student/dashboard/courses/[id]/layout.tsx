'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', path: '' },
  { name: 'Assignments', path: 'assignments' },
  { name: 'Announcements', path: 'announcements' },
  { name: 'Files', path: 'files' },
];

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const pathname = usePathname();

  const isActive = (path: string) => {
    const basePath = `/student/dashboard/courses/${id}`;
    if (path === '') return pathname === basePath;
    return pathname === `${basePath}/${path}`;
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] -ml-6"> {/* Matches instructor layout */}
      {/* Course Sidebar */}
      <aside className="w-56 fixed top-20 left-56 h-[calc(100vh-5rem)] from-white to-blue-200 text-red z-40 px-4 pt-6 overflow-y-auto">
        <h2 className="text-xl font-semibold px-4 mb-4">Course Menu</h2>
        <nav className="flex flex-col text-sm">
          {navItems.map(({ name, path }) => (
            <Link
              key={path}
              href={`/student/dashboard/courses/${id}/${path}`}
              className={`px-4 py-2 hover:bg-[#8e2c2c] ${
                isActive(path) ? 'bg-[#8e2c2c] font-medium text-white' : ''
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[14rem] -mt-9 pt-2 flex-1 p-6 bg-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
