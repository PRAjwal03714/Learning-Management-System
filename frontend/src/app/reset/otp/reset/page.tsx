'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function OtpResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setErrorMsg('Missing email. Please start from the beginning.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password, resetToken: null }), // OTP doesn't require token
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg('✅ Password reset successful! Redirecting to Login');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setErrorMsg(data.message || 'Password reset failed.');
      }
    } catch (err) {
      setErrorMsg('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-200 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password</h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-400 rounded-md"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-400 rounded-md"
        />

        {errorMsg && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm text-center rounded">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 text-sm text-center rounded">
            {successMsg}
          </div>
        )}

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}
