'use client';
import Link from 'next/link';
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
};

function SidebarItem({ icon, label, href, onClick }: SidebarItemProps) {
  const content = (
    <div
      onClick={onClick}
      className="flex items-center gap-3 py-2 px-3 rounded-md cursor-pointer hover:bg-[#8c1f1f] transition text-white"
    >
      <div className="text-lg">{icon}</div>
      <span className="text-md font-medium">{label}</span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function InstructorSidebar() {
  const { toggleCourseDrawer } = useSidebar();

  return (
    <aside className="fixed top-20 left-0 w-56 h-[calc(100vh-5rem)] bg-[#7B1C1C] text-white z-40 shadow-lg flex flex-col items-start pt-6 px-4">
      <SidebarItem icon={<FaUser />} label="Profile" href="/instructor/dashboard/profile" />
      <SidebarItem icon={<FaTachometerAlt />} label="Dashboard" href="/instructor/dashboard" />
      <SidebarItem icon={<FaBookOpen />} label="Courses" onClick={toggleCourseDrawer} />
      <SidebarItem icon={<FaBullhorn />} label="Announcements" href="/instructor/dashboard/announcements" />
      <SidebarItem icon={<FaCalendarAlt />} label="Calendar" href="/instructor/dashboard/calendar" />
      <SidebarItem icon={<FaClipboardList />} label="Assignments" href="/instructor/dashboard/assignments" />
      <SidebarItem icon={<FaSignOutAlt />} label="Logout" href="/logout" />
    </aside>
  );
}
