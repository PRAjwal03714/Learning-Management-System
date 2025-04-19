'use client';

import { useSidebar } from '@/context/SidebarContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaUserGraduate,
  FaTachometerAlt,
  FaBookOpen,
  FaCalendarAlt,
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
      className={`w-full py-6 flex flex-col items-center justify-center cursor-pointer transition 
        ${active ? 'bg-white text-[#7c0000] font-bold' : 'text-white hover:bg-[#9b1c1c]'}`}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <span className="text-base">{label}</span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function StudentSidebar() {
  const pathname = usePathname();
  const { toggleCourseDrawer } = useSidebar();

  return (
    <aside className="fixed top-20 left-0 w-56 h-[calc(100vh-5rem)] bg-[#7c0000] text-white z-40 shadow-lg flex flex-col items-center">
      <div className="w-full">
        <SidebarItem
          icon={<FaUserGraduate />}
          label="Profile"
          href="/student/dashboard/profile"
          active={pathname.startsWith('/student/dashboard/profile')}
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
          icon={<FaCalendarAlt />}
          label="Calendar"
          href="/student/dashboard/calendar"
          active={pathname.startsWith('/student/dashboard/calendar')}
        />
      </div>
    </aside>
  );
}
