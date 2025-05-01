'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUser, FaCalendarAlt, FaBook } from 'react-icons/fa';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/admin/profile', label: 'Profile', icon: <FaUser /> },
    { href: '/admin/calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
    { href: '/admin/courses', label: 'Courses', icon: <FaBook /> },
  ];

  return (
    <aside className="fixed top-20 left-0 w-56 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 shadow-md flex flex-col p-4 space-y-2">
      {links.map(({ href, label, icon }) => (
        <Link key={href} href={href}>
          <div
            className={`flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-100 ${
              pathname === href ? 'bg-[#7c0000] text-white font-semibold' : 'text-gray-700'
            }`}
          >
            {icon}
            <span>{label}</span>
          </div>
        </Link>
      ))}
    </aside>
  );
}
