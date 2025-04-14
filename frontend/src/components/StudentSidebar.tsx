'use client';

import { useSidebar } from '@/context/SidebarContext';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaUserGraduate,
  FaTachometerAlt,
  FaBookOpen,
  FaCalendarAlt,
  FaClipboardList,
} from 'react-icons/fa';

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

function SidebarItem({ icon, label, href, onClick, active }: SidebarItemProps) {

  const content = (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 py-2 px-3 rounded-md cursor-pointer transition
        ${active ? 'bg-white text-red-800 font-semibold' : 'text-white hover:bg-[#8c1f1f]'}`}
    >
      <div className="text-lg">{icon}</div>
      <span className="text-md font-medium">{label}</span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function StudentSidebar() {
  const pathname = usePathname();
  const { toggleCourseDrawer } = useSidebar();


  return (
    <aside className="fixed top-20 left-0 w-56 h-[calc(100vh-5rem)] bg-gradient-to-br from-red-800 to-red-800 text-white z-40 shadow-lg flex flex-col items-start pt-6 px-4">
      <SidebarItem
        icon={<FaUserGraduate />}
        label="Profile"
        href="/student/dashboard/profile"
        active={pathname === '/student/dashboard/profile'}
      />
      <SidebarItem
        icon={<FaTachometerAlt />}
        label="Dashboard"
        href="/student/dashboard"
        active={pathname === '/student/dashboard'}
      />
      <SidebarItem
  icon={<FaBookOpen />}
  label="Courses"
  onClick={toggleCourseDrawer}
  active={pathname.startsWith('/student/dashboard/courses')}
/>

      <SidebarItem
        icon={<FaClipboardList />}
        label="Assignments"
        href="/student/dashboard/assignments"
        active={pathname === '/student/dashboard/assignments'}
      />
      <SidebarItem
        icon={<FaCalendarAlt />}
        label="Calendar"
        href="/student/dashboard/calendar"
        active={pathname === '/student/dashboard/calendar'}
      />
    </aside>
  );
}
