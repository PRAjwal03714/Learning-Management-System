'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBullhorn } from 'react-icons/fa';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  course_title: string;
}

export default function AllInstructorAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data.announcements);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch announcements');
      }
    };

    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.content.toLowerCase().includes(search.toLowerCase()) ||
    a.course_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaBullhorn className="text-blue-600" />
          All Course Announcements
        </h1>
      </div>

      <input
        type="text"
        placeholder="Search announcements..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-lg mb-6 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

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
                  <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                    {a.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-1">{a.course_title}</p>
                  <p className="text-gray-700 text-sm line-clamp-2">{a.content}</p>
                </div>
              </div>
              <div className="text-sm font-bold text-gray-500 whitespace-nowrap">
                Posted on:<br />
                {new Date(a.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
