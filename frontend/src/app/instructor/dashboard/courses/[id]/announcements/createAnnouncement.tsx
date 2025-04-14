'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateAnnouncement = ({ courseId }: { courseId: string }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5001/api/announcements/create',
        { title, content, course_id: courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Announcement created!');
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
      toast.error('Error creating announcement');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Announcement</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Content"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
          type="submit"
        >
          Post Announcement
        </button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
