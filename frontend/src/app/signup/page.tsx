// src/app/signup/page.tsx
'use client';

export default function Signup() {
  return (
    <div className="w-full max-w-md bg-white border border-gray-300 rounded-md p-8 shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="username" className="block font-semibold text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-semibold text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="securityQuestion" className="block font-semibold text-gray-700 mb-1">
            Security Question
          </label>
          <select
            id="securityQuestion"
            defaultValue="DEFAULT"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
          >
            <option value="DEFAULT" disabled hidden>Select a security question</option>
            <option value="Q1">What color is your favorite?</option>
            <option value="Q2">What was the name of the town you grew up in?</option>
            <option value="Q3">What was the name of your first pet?</option>
            <option value="Q4">In what town did you meet your partner?</option>
          </select>
        </div>

        <div>
          <label htmlFor="securityAnswer" className="block font-semibold text-gray-700 mb-1">
            Security Answer
          </label>
          <input
            type="text"
            id="securityAnswer"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
      </p>
    </div>
  );
}
