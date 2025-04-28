'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBullhorn } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Course {
  name: string;
}

export default function StudentAnnouncementsPage() {
  const { id } = useParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data.course);
      } catch {
        toast.error('Failed to fetch course info');
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements/by-course/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data.announcements || []);
      } catch {
        toast.error('Failed to fetch announcements');
      }
    };

    fetchCourse();
    fetchAnnouncements();
  }, [id]);

  const filtered = announcements
    .filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filterOption === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (filterOption === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (filterOption === 'title-asc') return a.title.localeCompare(b.title);
      if (filterOption === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <div className="mt-1">
      {/* 🔷 Breadcrumb Header */}
      <div className="text-xl font-semibold text-blue-700 mb-2">
        <span
          onClick={() => (window.location.href = `/student/dashboard/courses/${id}`)}
          className="cursor-pointer hover:underline"
        >
          {course?.name || 'Course'}
        </span>
        <span className="text-gray-400"> › </span>
        <span className="text-red-600">Announcements</span>
      </div>

      {/* 🔔 Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaBullhorn className="text-blue-600" /> Announcements
      </h2>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
      </div>

      {/* 📜 Announcements List */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 italic">No announcements found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((a) => (
            <li
              key={a.id}
              className="border border-gray-300 rounded-md p-4 hover:shadow transition bg-white flex justify-between items-start"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaBullhorn className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{a.title}</h3>
                  <p className="text-gray-700 text-sm mt-1">{a.content}</p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-500 whitespace-nowrap pl-6">
                {new Date(a.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
