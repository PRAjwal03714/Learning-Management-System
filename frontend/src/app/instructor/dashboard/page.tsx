'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstructorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/instructor/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return null; // or a loading spinner

  return (
    <div className="p-8 text-gray-700">
      <h1 className="text-2xl font-bold mb-4">Welcome to Instructor Dashboard</h1>
      <p>Here you can manage your courses, announcements, and assignments.</p>
    </div>
  );
}
