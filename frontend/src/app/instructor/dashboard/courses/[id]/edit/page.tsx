'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface Course {
  department: string;
  number: string;
  name: string;
  term: string;
  start_date: string;
  end_date: string;
  credits: string;
  is_published: boolean;
  is_active: boolean;
}

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<Course>({
    department: '',
    number: '',
    name: '',
    term: '',
    start_date: '',
    end_date: '',
    credits: '',
    is_published: false,
    is_active: true,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await fetch(`http://localhost:5001/api/courses/my-courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      const course = data.courses.find((c: Course & { id: string }) => c.id === id);

      if (course) {
        // Format date to yyyy-MM-dd
        const formatDate = (dateStr: string) => new Date(dateStr).toISOString().split('T')[0];

        setForm({
          ...course,
          start_date: formatDate(course.start_date),
          end_date: formatDate(course.end_date),
        });
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5001/api/courses/update-course/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Course updated successfully!');
        router.push('/instructor/dashboard/courses');
      } else {
        toast.error(data.message || 'Update failed.');
      }
    } catch {
      toast.error('Server error occurred. Please try again later.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input name="department" value={form.department} onChange={handleChange} className="border p-2 rounded" />
        <input name="number" value={form.number} onChange={handleChange} className="border p-2 rounded" />
        <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded col-span-2" />
        <input name="term" value={form.term} onChange={handleChange} className="border p-2 rounded" />
        <input name="credits" value={form.credits} onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="border p-2 rounded" />

        <div className="col-span-2 flex gap-8 mt-2 items-center">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} />
            <span className="text-sm">Published</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <div className="col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full">
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
}
