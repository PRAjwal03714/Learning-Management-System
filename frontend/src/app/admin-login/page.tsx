'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
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
      // ❗ Replace this URL with actual backend endpoint later
      const res = await fetch('http://localhost:5001/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg('✅ Admin login successful!');
        localStorage.setItem('token', data.token); // optional for auth
        router.push('/admin/dashboard'); // redirect to admin dashboard
      } else {
        setErrorMsg(data.message || 'Login failed');
      }
    } catch (err) {
      console.log(err)
      setErrorMsg('❌ Server error (API not ready)');
    }

    setTimeout(() => {
      setErrorMsg('');
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-300 rounded-md shadow-xl p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-semibold text-sm text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={form.email}
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
    </div>
  );
}
