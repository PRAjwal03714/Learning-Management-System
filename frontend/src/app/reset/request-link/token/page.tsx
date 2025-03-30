'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResetTokenPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5001/api/auth/reset-password/${params.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword: password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMsg('✅ Password reset successful! Redirecting...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setMsg(`❌ ${data.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <div className="max-w-md w-full bg-white border border-gray-300 rounded-md p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Set New Password</h1>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Reset Password
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-blue-700">{msg}</p>}
      </div>
    </div>
  );
}
