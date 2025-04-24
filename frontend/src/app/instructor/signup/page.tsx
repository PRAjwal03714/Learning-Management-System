'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

export default function InstructorSignup() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('❌ Passwords do not match');
      return;
    }

    const payload = {
      name: form.username,
      email: form.email,
      username: form.username,
      password: form.password,
      role: 'instructor',
      securityQuestion: form.securityQuestion,
      securityAnswer: form.securityAnswer,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registration successful. Awaiting admin approval.');
        setForm({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          securityQuestion: '',
          securityAnswer: '',
        });
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const msg = data.errors.map((e: { msg: string }) => e.msg).join('\n');
          toast.error(msg);
        } else {
          toast.error(data.message || 'Unknown error occurred');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to connect to backend');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-md p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Instructor Sign Up</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">Email</label>
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
            <label htmlFor="username" className="block font-semibold text-gray-700 mb-1">Username</label>
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
            <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">Password</label>
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
            <label htmlFor="confirmPassword" className="block font-semibold text-gray-700 mb-1">Confirm Password</label>
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
            <label htmlFor="securityQuestion" className="block font-semibold text-gray-700 mb-1">Security Question</label>
            <select
              id="securityQuestion"
              value={form.securityQuestion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            <label htmlFor="securityAnswer" className="block font-semibold text-gray-700 mb-1">Security Answer</label>
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
            Register as Instructor
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already registered?{' '}
          <a href="/instructor/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}
