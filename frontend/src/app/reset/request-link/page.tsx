'use client';

import { useState } from 'react';

export default function RequestResetLinkPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleRequest = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMsg('✅ Reset link sent to your email.');
    } else {
      setMsg(`❌ ${data.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <div className="max-w-md w-full bg-white border border-gray-300 rounded-md p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset via Email Link</h1>

        <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">
          Enter your registered email:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-400 rounded-md mb-4"
        />

        <button
          onClick={handleRequest}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Send Reset Link
        </button>

        {msg && <p className="mt-4 text-center text-blue-700">{msg}</p>}
      </div>
    </div>
  );
}
