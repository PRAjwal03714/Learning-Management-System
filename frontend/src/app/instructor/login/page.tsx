'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstructorLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ instructorId: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:5001/api/auth/instructor-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      // console.log("Login Response:", data);

      if (res.ok) {
        setSuccessMsg('✅ Instructor login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'instructor');
        router.push('/instructor/dashboard');
      } else {
        setErrorMsg(data.message || 'Login failed');
      }
    } catch (err) {
      console.log(err);
      setErrorMsg('❌ Server error');
    }

    setTimeout(() => {
      setErrorMsg('');
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-300 rounded-md shadow-xl p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Instructor Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="instructorId" className="block font-semibold text-sm text-gray-700 mb-1">
            Instructor ID
          </label>
          <input
            type="text"
            id="instructorId"
            value={form.instructorId}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-semibold text-sm text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-700 transition font-semibold cursor-pointer"
        >
          Log in
        </button>
      </form>

      {errorMsg && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 text-sm rounded text-center">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 text-sm rounded text-center">
          {successMsg}
        </div>
      )}

      <p className="mt-4 text-center text-sm text-gray-700">
        Don’t have an account?{' '}
        <a href="/instructor/signup" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
}
