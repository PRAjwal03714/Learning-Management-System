'use client';

import { useState, useEffect } from 'react';
import CreateAnnouncement from './createAnnouncement';
import ViewAnnouncements from './ViewAnnouncements';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

type Course = {
  name: string;
};

export default function AnnouncementsPage() {
  const { id: courseId } = useParams();
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('view');
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data.course);
      } catch {
        toast.error('Failed to fetch course info');
      }
    };

    fetchCourse();
  }, [courseId]);

  return (
    <div className="p-6 -mt-6">
      {/* Breadcrumb */}
      {course && (
        <div className="mb-4 text-xl font-semibold text-gray-800">
          <span
            onClick={() => window.location.href = `/instructor/dashboard/courses/${courseId}`}
            className="text-blue-700 hover:underline cursor-pointer"
          >
            {course.name}
          </span>
          <span className="text-gray-400 mx-1">›</span>
          <span className="text-red-600">Announcements</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('view')}
          className={`px-4 py-2 rounded cursor-pointer ${activeTab === 'view' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          View Announcements
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded cursor-pointer ${activeTab === 'create' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          Create Announcement
        </button>
      </div>

      {activeTab === 'view' ? (
        <ViewAnnouncements courseId={courseId as string} />
      ) : (
        <CreateAnnouncement courseId={courseId as string} />
      )}
    </div>
  );
}
