'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');


    try {
      console.log("✅ API:", process.env.NEXT_PUBLIC_API_URL);

      console.log("🔥 Fetching from:", `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.duoRequired) {
        const duoRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/duo/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.email }),
        });

        const { authUrl } = await duoRes.json();
        window.location.href = authUrl;
      } else if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/student/dashboard');
      } else {
        setErrorMsg('Login failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server error');
    }
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-300 rounded-md shadow-xl p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Student Login</h1>

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

      {/* Error & Success Messages */}
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

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-2 text-gray-500 text-sm">or log in with</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      {/* OAuth Buttons */}
      <div className="flex justify-between">
        <a
href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/facebook`}
className="flex items-center justify-center w-1/2 mr-2 px-2 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          <span className="font-semibold">f</span>&nbsp;Facebook
        </a>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
          className="flex items-center justify-center w-1/2 ml-2 px-2 py-2 border border-gray-300 text-sm rounded hover:bg-gray-100"
        >
          <img src="/gg1.png" alt="Google" className="w-5 h-5 mr-2" />
          Google
        </a>
      </div>

      {/* Reset & Signup */}
      <div className="text-center mt-4 text-sm">
        <a href="/reset" className="text-blue-600 hover:underline">
          Reset Password
        </a>
      </div>
      <p className="mt-2 text-center text-sm text-gray-700">
        Don’t have an account?{' '}
        <a href="/signup" className="text-blue-600 hover:underline">
          Create one here
        </a>
      </p>
    </div>
  );
}
