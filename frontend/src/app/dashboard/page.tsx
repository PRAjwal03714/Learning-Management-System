'use client';
import { useState } from 'react';
import {
  FaUser,
  FaHome,
  FaCog,
  FaSignOutAlt,
  FaAngleLeft,
  FaAngleRight
} from 'react-icons/fa';

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-800 via-purple-500 to-pink-400 shadow-2xl flex items-center pl-4 z-50">
        <h1 className="text-4xl text-white font-bold">StudyMate</h1>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-20 left-0 h-[calc(100vh-5rem)] bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col z-40`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h2 className={`font-bold text-lg ${collapsed ? 'hidden' : 'block'}`}>Navigation</h2>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 bg-gray-800 rounded hover:cursor-pointer"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
          </button>
        </div>

        <div className="flex flex-col mt-4 space-y-4 px-4">
          <div className="flex items-center gap-3 hover:cursor-pointer">
            <FaUser />
            {!collapsed && <span>Profile</span>}
          </div>
          <div className="flex items-center gap-3 hover:cursor-pointer">
            <FaHome />
            {!collapsed && <span>Dashboard</span>}
          </div>
          <div className="flex items-center gap-3 hover:cursor-pointer">
            <FaCog />
            {!collapsed && <span>Settings</span>}
          </div>
          <div className="flex items-center gap-3 hover:cursor-pointer">
            <FaSignOutAlt />
            {!collapsed && <span>Log out</span>}
          </div>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className={`ml-${collapsed ? '16' : '64'} mt-20 h-[calc(100vh-5rem)] overflow-y-auto p-6`}>
        <div className="text-center text-gray-700">
          <h1 className="text-2xl font-semibold mb-6">Welcome to your Dashboard</h1>

          {/* Dummy content for scroll test */}
          <div className="space-y-10">
        
          </div>
        </div>
      </div>
    </div>
  );
}
