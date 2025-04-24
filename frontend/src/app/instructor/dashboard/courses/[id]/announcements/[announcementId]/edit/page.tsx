'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditAnnouncementPage = () => {
  const { id: courseId, announcementId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements/${announcementId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.log(err)

        toast.error("Failed to fetch announcement");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [announcementId]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/announcements/${announcementId}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success("Announcement updated!");
      router.push(`/instructor/dashboard/courses/${courseId}/announcements`);
    } catch (err) {
        console.log(err)
      toast.error("Failed to update announcement");
    }
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit Announcement</h2>
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 rounded w-full mb-4"
        rows={6}
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Save Changes
        </button>
        <button
          onClick={() => router.back()}
          className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditAnnouncementPage;
