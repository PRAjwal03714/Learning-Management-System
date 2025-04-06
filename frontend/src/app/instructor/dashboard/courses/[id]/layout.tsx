'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', path: 'home' },
  { name: 'Assignments', path: 'assignments' },
  { name: 'Announcements', path: 'announcements' },
  { name: 'Syllabus', path: 'syllabus' },
];

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.endsWith(path);

  return (
    <div className="flex h-[calc(100vh-5rem)] -ml-6"> {/* Aligned to InstructorSidebar */}
      {/* Course-specific sidebar */}
      <aside className="w-56 fixed top-20 left-56 h-[calc(100vh-5rem)]  from-white to-blue-200
 text-red z-40 px-4 pt-6 overflow-y-auto">
      <h2 className="text-sm font-semibold px-4 mb-4">Course Menu</h2>
        <nav className="flex flex-col text-sm">
          {navItems.map(({ name, path }) => (
            <Link
              key={path}
              href={`/instructor/dashboard/courses/${id}/${path}`}
              className={`px-4 py-2 hover:bg-[#8e2c2c] ${
                isActive(path) ? 'bg-[#8e2c2c] font-medium' : ''
              }`}
            >
              {name}
            </Link>
          ))}
          <hr className="my-3 border-gray-400 mx-4" />
          <Link
            href={`/instructor/dashboard/courses/${id}/edit`}
            className="text-yellow-400 hover:underline px-4 py-2"
          >
            ✏️ Edit Course
          </Link>
          <Link
            href={`/instructor/dashboard/courses/${id}/delete`}
            className="text-red-400 hover:underline px-4 py-2"
          >
            🗑 Delete Course
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-[14rem] flex-1 p-6 bg-gradient-to-b from-white to-blue-100 overflow-y-auto">
  {children}
</main>

    </div>
  );
}
