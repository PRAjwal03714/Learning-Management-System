'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Signup() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
  });
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (form.password !== form.confirmPassword) {
      setErrorMsg('❌ Passwords do not match');
      return;
    }

    const payload = {
      name: form.username,
      email: form.email,
      username: form.username,
      password: form.password,
      role: 'student',
      securityQuestion: form.securityQuestion,
      securityAnswer: form.securityAnswer,
    };

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('✅ Registration successful! Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000); // wait 3s before redirect
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const msg = data.errors.map((e: { msg: string }) => e.msg).join('\n');
          toast.error(msg);
        } else {
          toast.error(data.message || 'Unknown error occurred');
        }
      }
    }
      catch (error) {
      console.error(error);
      setErrorMsg('❌ Failed to connect to backend');
    }

    setTimeout(() => {
      setErrorMsg('');
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh]">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-md p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="securityQuestion" className="block font-semibold text-gray-700 mb-1 ">
              Security Question
            </label>
            <select
              id="securityQuestion"
              value={form.securityQuestion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 cursor-pointer"
              required
            >
              <option value="" disabled hidden>Select a security question</option>
              <option value="What color is your favorite?">What color is your favorite?</option>
              <option value="What was the name of the town you grew up in?">What was the name of the town you grew up in?</option>
              <option value="What was the name of your first pet?">What was the name of your first pet?</option>
              <option value="In what town did you meet your partner?">In what town did you meet your partner?</option>
            </select>
          </div>

          <div>
            <label htmlFor="securityAnswer" className="block font-semibold text-gray-700 mb-1 ">
              Security Answer
            </label>
            <input
              type="text"
              id="securityAnswer"
              value={form.securityAnswer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded text-center">
            {successMsg}
          </div>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
