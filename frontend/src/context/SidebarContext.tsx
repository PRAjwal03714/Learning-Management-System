'use client';
import { createContext, useState, ReactNode, useContext } from 'react';

interface SidebarContextType {
  showCourseDrawer: boolean;
  toggleCourseDrawer: () => void;
  closeCourseDrawer: () => void;
  courseView: 'list' | 'create' | null;
  setCourseView: (view: 'list' | 'create' | null) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  showCourseDrawer: false,
  toggleCourseDrawer: () => {},
  closeCourseDrawer: () => {},
  courseView: null,
  setCourseView: () => {},
});

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [showCourseDrawer, setShowCourseDrawer] = useState(false);
  const [courseView, setCourseView] = useState<'list' | 'create' | null>(null);

  const toggleCourseDrawer = () => setShowCourseDrawer((prev) => !prev);
  const closeCourseDrawer = () => setShowCourseDrawer(false);

  return (
    <SidebarContext.Provider
      value={{ showCourseDrawer, toggleCourseDrawer, closeCourseDrawer, courseView, setCourseView }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// ⛳ Optional hook
export const useSidebar = () => useContext(SidebarContext);
