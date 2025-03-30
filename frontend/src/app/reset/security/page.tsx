'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SecurityQuestionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!email || !securityAnswer.trim()) {
      setError('Please provide your answer.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/verify-security-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, securityAnswer }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to reset-password page with reset token
        router.push(`/reset/security/reset?email=${encodeURIComponent(email)}&token=${data.resetToken}`);
      } else {
        setError(data.message || 'Verification failed');
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
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Verify Security Question</h1>

        <p className="mb-4 text-gray-700 text-sm text-center">
          We have a security question saved for your account. Please provide the answer.
        </p>

        <label className="block font-semibold mb-2 text-gray-700">Your Answer</label>
        <input
          type="text"
          value={securityAnswer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
          className="w-full px-4 py-2 border border-gray-400 rounded-md mb-4"
        />

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm text-center rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Verifying...' : 'Verify Answer'}
        </button>
      </div>
    </div>
  );
}
