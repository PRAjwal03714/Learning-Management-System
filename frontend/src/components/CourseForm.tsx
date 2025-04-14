'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const [form, setForm] = useState({
    department: '',
    number: '',
    name: '',
    term: '',
    start_date: '',
    end_date: '',
    credits: '',
    is_published: true,
    is_active: true,
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5001/api/courses/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.course?.id) {
        toast.success('✅ Course created successfully!');
        router.push(`/instructor/dashboard/courses/${data.course.id}`); // ✅ Redirect to course home
      } else {
        toast.error(data.message || 'Failed to create course');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Server error. Try again.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Create a New Course</h1>
      <p className="text-sm text-gray-500 mb-6">
        Fill out the course information below. All fields are required.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Department</label>
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Course Number</label>
          <input
            name="number"
            type="number"
            value={form.number}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Course Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Term</label>
          <input
            name="term"
            value={form.term}
            onChange={handleChange}
            placeholder="Spring 2025"
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Credits</label>
          <input
            name="credits"
            type="number"
            value={form.credits}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="cursor-pointer block text-sm text-gray-700 mb-1">Start Date</label>
          <input
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            className="cursor-pointer w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="cursor-pointer block text-sm text-gray-700 mb-1">End Date</label>
          <input
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
            className="cursor-pointer w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>

        <div className="cursor-pointer flex items-center gap-6 col-span-2 mt-2">
          <label className="cursor-pointer flex items-center text-xl">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
              className="mr-2"
            />
            Published
          </label>

          <label className="cursor-pointer flex items-center text-xl">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="mr-2"
            />
            Active
          </label>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded mt-4"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}
