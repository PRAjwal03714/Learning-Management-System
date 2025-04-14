'use client';

import axios from 'axios';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';

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
    const basePath = `/instructor/dashboard/courses/${id}`;
    if (path === '') return pathname === basePath; // Home path match
    return pathname === `${basePath}/${path}`;
  };
  
  
  
  return (
    <div className="flex h-[calc(100vh-5rem)] -ml-6 "> {/* Aligned to InstructorSidebar */}
      {/* Course-specific sidebar */}
      <aside className="w-56 fixed top-20 left-56 h-[calc(100vh-5rem)]  from-white to-blue-200
 text-red z-40 px-4 pt-6 overflow-y-auto">
      <h2 className="text-xl font-semibold px-4 mb-4">Course Menu</h2>
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
          <button
  onClick={async () => {
    const confirmed = confirm("Are you sure you want to delete this course?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5001/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success("Course deleted");
      window.location.href = "/instructor/dashboard"; // or use router.push if you have router
    } catch (err) {
      console.error("❌ Failed to delete course:", err);
      toast.error("Failed to delete course");
    }
  }}
  className="text-red-400 hover:underline px-4 py-2 text-left w-full cursor-pointer"
>
  🗑 Delete Course
</button>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-[14rem] -mt-9 pt-2 flex-1 p-6 bg-white overflow-y-auto">
      {children}
</main>

    </div>
  );
}
