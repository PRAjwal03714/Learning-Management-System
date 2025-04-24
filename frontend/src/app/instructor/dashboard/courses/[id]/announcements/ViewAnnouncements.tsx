'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

type Announcement = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type Course = {
  name: string;
  department: string;
  number: string;
  term: string;
};

interface Props {
  courseId: string;
}

const ViewAnnouncements = ({ courseId }: Props) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(''); // ✅ Search state
  const router = useRouter();

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements/by-course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAnnouncements(res.data.announcements);
    } catch (err) {
      console.log(err);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCourse(res.data.course);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchCourse();
  }, [courseId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success("Announcement deleted");
      fetchAnnouncements();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  // ✅ Filtered announcements based on search
  const filteredAnnouncements = announcements.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-gray-600">Loading announcements...</p>;

  return (
    <div className="p-6">
      {course && (
        <h1 className="text-xl font-semibold text-gray-700 mb-6">
          {/* You can display course name here if you want */}
        </h1>
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between mb-6 -mt-11 -ml-6">
        <div className="flex items-center gap-2">
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option>All</option>
          </select>
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          />
        </div>
        
      </div>

      {/* Announcement Cards */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <p className="text-gray-500">No announcements found</p>
        ) : (
          filteredAnnouncements.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between border-t pt-4 pb-3 hover:bg-gray-50"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {a.title[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 text-base">
                    {a.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2 max-w-3xl">
                    {a.content}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end text-sm text-gray-500 whitespace-nowrap">
                <span>Posted on:</span>
                <span>{new Date(a.created_at).toLocaleString()}</span>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      router.push(`/instructor/dashboard/courses/${courseId}/announcements/${a.id}/edit`)
                    }
                    className="text-blue-600 text-sm cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-600 text-sm cursor-pointer"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewAnnouncements;
