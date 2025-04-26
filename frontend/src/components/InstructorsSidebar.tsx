'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaUser,
  FaTachometerAlt,
  FaBookOpen,
  FaBullhorn,
  FaCalendarAlt,
  FaClipboardList,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useSidebar } from '@/context/SidebarContext';

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

const handleLogout = () => {
  // localStorage.clear();
  localStorage.removeItem('token');
  // Clear token/session if needed
  window.location.href = '/'; // Redirect to login/home
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

export default function InstructorSidebar() {
  const pathname = usePathname();
  const { toggleCourseDrawer } = useSidebar();

  const isCoursesActive = pathname.startsWith('/instructor/dashboard/courses');

  return (
    <aside className="fixed top-20 left-0 w-56 h-[calc(100vh-5rem)] bg-[#7c0000] text-white z-40 shadow-lg flex flex-col items-center">
      <div className="w-full">
        <SidebarItem
          icon={<FaUser />}
          label="Profile"
          href="/instructor/dashboard/profile"
          active={pathname === '/instructor/dashboard/profile'}
        />
        <SidebarItem
          icon={<FaTachometerAlt />}
          label="Dashboard"
          href="/instructor/dashboard"
          active={pathname === '/instructor/dashboard'}
        />
        <SidebarItem
          icon={<FaBookOpen />}
          label="Courses"
          onClick={toggleCourseDrawer}
          active={isCoursesActive}
        />
        <SidebarItem
          icon={<FaBullhorn />}
          label="Announcements"
          href="/instructor/dashboard/announcements"
          active={pathname === '/instructor/dashboard/announcements'}
        />
        <SidebarItem
          icon={<FaClipboardList />}
          label="Assignments"
          href="/instructor/dashboard/assignments"
          active={pathname === '/instructor/dashboard/assignments'}
        />
        <SidebarItem
          icon={<FaCalendarAlt />}
          label="Calendar"
          href="/instructor/dashboard/calendar"
          active={pathname === '/instructor/dashboard/calendar'}
        />
         <SidebarItem
          icon={<FaCalendarAlt />}
          label="Calendar"
          href="/instructor/dashboard/calendar"
          active={pathname === '/instructor/dashboard/calendar'}
        />

<SidebarItem
  icon={<FaSignOutAlt />}
  label="Logout"
  onClick={handleLogout}
/>  
      </div>
    </aside>
  );
}
