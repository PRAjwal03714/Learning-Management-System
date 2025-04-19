'use client';

import axios from 'axios';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import CourseChat from '@/components/CourseChat';

const navItems = [
  { name: 'Home', path: '' },
  { name: 'Assignments', path: 'assignments' },
  { name: 'Grades', path: 'grades' },
  { name: 'Announcements', path: 'announcements' },
  { name: 'Files', path: 'files' },
  { name: 'Chat', path: 'chat' },
];

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const pathname = usePathname();

  const isActive = (path: string) => {
    const basePath = `/instructor/dashboard/courses/${id}`;
    if (path === '') return pathname === basePath;
    return pathname === `${basePath}/${path}`;
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this course?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Course deleted');
      window.location.href = '/instructor/dashboard';
    } catch (err) {
      console.error('❌ Failed to delete course:', err);
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] -ml-6">
      {/* Course Sidebar */}
      <aside className="w-56 fixed top-20 left-56 h-[calc(100vh-5rem)] from-white to-blue-200 text-red z-40 px-4 pt-6 overflow-y-auto">        
        <h2 className="text-xl font-semibold px-4 mb-4 text-[#7c0000]">Course Menu</h2>
        <nav className="flex flex-col text-md">
          {navItems.map(({ name, path }) => (
            <Link
              key={path}
              href={`/instructor/dashboard/courses/${id}/${path}`}
              className={`px-4 py-2 hover:bg-[#8e2c2c] ${
                isActive(path) ? 'bg-[#8e2c2c] font-medium text-white' : ''
              }`}

            >
              {name}
            </Link>
          ))}

          <hr className="my-3 border-gray-300 mx-4" />

          <Link
            href={`/instructor/dashboard/courses/${id}/edit`}
            className="px-4 py-2 w-full text-left text-black hover:underline"
          >
            Edit Course
          </Link>

          <button
            onClick={handleDelete}
            className="px-4 py-2 w-full text-left text-[#7c0000] hover:underline cursor-pointer"
          >
            Delete Course
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-[14rem] -mt-9 pt-2 flex-1 p-6 bg-white overflow-y-auto">
        <div className="p-6">
          {pathname.endsWith('/chat') ? <CourseChat /> : children}
        </div>
      </main>
    </div>
  );
}
