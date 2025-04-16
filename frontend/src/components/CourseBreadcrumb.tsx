'use client';

import { useRouter } from 'next/navigation';

interface Props {
  courseId: string;
  department: string;
  number: string;
  term: string;
  courseName: string;
  currentPage?: string;
}

const CourseBreadcrumb = ({ courseId, courseName, currentPage = 'Announcements' }: Props) => {
  const router = useRouter();

  return (
    <div className="mb-4 mt-2">
      <h1 className="text-xl font-semibold text-gray-800">
        <span
          className="text-blue-700 hover:underline cursor-pointer"
          onClick={() => router.push(`/instructor/dashboard/courses/${courseId}`)}
        >
          {courseName}
        </span>
        <span className="text-gray-400"> › </span>
        <span className="text-red-600">{currentPage}</span>
      </h1>
    </div>
  );
};

export default CourseBreadcrumb;
