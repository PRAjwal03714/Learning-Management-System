'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOptionClick = async (option: 'forgot' | 'login') => {
    if (!email) {
      setErrorMsg('Please enter your email or username.');
      return;
    }

    // Check if user exists
    try {
      const res = await fetch('http://localhost:5001/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.exists) {
        setErrorMsg('User not found. Please check your input.');
        return;
      }

      // Clear error and proceed
      setErrorMsg('');
      if (option === 'forgot') {
        router.push(`/reset/forgot?email=${encodeURIComponent(email)}`);
      } else {
        router.push('/login');
      }
    } catch (err) {
      setErrorMsg('Server error. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <div className="max-w-md w-full bg-white shadow-xl border border-gray-300 rounded-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Passphrase Reset</h1>

        <label htmlFor="email" className="block text-lg font-semibold text-gray-800 mb-2">
          Username
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />

        {errorMsg && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm text-center rounded">
            {errorMsg}
          </div>
        )}

        <button
          onClick={() => handleOptionClick('forgot')}
          className="w-full mb-4 py-3 text-lg font-bold text-red-800 border-2 border-red-800 rounded-md hover:bg-red-50 cursor-pointer"
        >
          I don&apos;t know my passphrase
        </button>

        <button
          onClick={() => handleOptionClick('login')}
          className="w-full py-3 text-lg font-bold text-red-800 border-2 border-red-800 rounded-md hover:bg-red-50 cursor-pointer"
        >
          I know my passphrase
        </button>
      </div>
    </div>
  );
}
