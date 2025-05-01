// ======= admin/dashboard/page.tsx =======
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Instructor {
  id: string;
  name: string;
  email: string;
  is_approved: boolean;
}

export default function AdminDashboard() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    fetchPendingInstructors();
  }, []);

  const fetchPendingInstructors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/pending-instructors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstructors(res.data.instructors);
    } catch (err) {
      console.error('Error fetching pending instructors', err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/approve-instructor`, { instructorId: id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPendingInstructors(); // Refresh list
    } catch (err) {
      console.error('Error approving instructor', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-lg font-semibold mb-2">Pending Instructors</h2>
      {instructors.length === 0 ? (
        <p className="text-gray-500">No instructors pending approval.</p>
      ) : (
        <div className="space-y-4">
          {instructors.map((instr) => (
            <div key={instr.id} className="flex justify-between items-center p-4 border rounded">
              <div>
                <p className="font-semibold">{instr.name}</p>
                <p className="text-sm text-gray-600">{instr.email}</p>
              </div>
              <button
                onClick={() => handleApprove(instr.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
