'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailFromQuery);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5001/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('✅ Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2500);
    } else {
      setMessage(data.message || '❌ Reset failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="max-w-md w-full bg-white border border-gray-300 rounded-md p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Reset via Token</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Enter your token"
            value={token}
            required
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-blue-700">{message}</div>
        )}
      </div>
    </div>
  );
}
