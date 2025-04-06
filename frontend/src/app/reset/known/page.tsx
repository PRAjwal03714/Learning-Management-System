'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ChangePasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage("❌ New passwords do not match");
      return;
    }

    const res = await fetch('http://localhost:5001/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, currentPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('✅ Password updated! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setMessage(data.message || '❌ Error changing password');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow border border-gray-300">
        <h1 className="text-2xl font-bold text-center mb-6">Change Your Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </form>
        {message && <div className="mt-4 text-center text-sm text-red-600">{message}</div>}
      </div>
    </div>
  );
}
