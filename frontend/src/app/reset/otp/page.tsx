/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OTPVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      setError('Missing email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/send-otp-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'OTP sent!');
        setStep('verify');
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/verify-otp-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/reset/otp/reset?email=${encodeURIComponent(email!)}`);
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-200 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          OTP Verification
        </h1>

        {step === 'send' ? (
          <>
            <p className="text-gray-700 text-sm mb-4">
              We’ll send a 6-digit code to your email. Click below to send.
            </p>
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <label className="block font-semibold mb-2 text-gray-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded-md mb-4"
              maxLength={6}
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}

        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
