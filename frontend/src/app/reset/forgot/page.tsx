'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ForgotOptionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleOptionClick = (path: string) => {
    if (!email) {
      alert('Missing email. Please go back and enter it again.');
      return;
    }
    router.push(`/reset/${path}?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <div className="max-w-2xl w-full bg-white shadow-lg border border-gray-300 rounded-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Reset Your Password</h1>
        <p className="text-center text-gray-600 mb-8">
          Choose a method to verify your identity and reset your password.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => handleOptionClick('security')}
            className="cursor-pointer p-6 border border-blue-500 rounded-lg text-center shadow hover:bg-blue-50 transition"
          >
            <div className="text-4xl mb-2">❓</div>
            <h2 className="font-semibold text-lg text-blue-600">Security Question</h2>
            <p className="text-sm text-gray-600 mt-2">Answer your saved security question.</p>
          </div>

          <div
            onClick={() => handleOptionClick('otp')}
            className="cursor-pointer p-6 border border-purple-500 rounded-lg text-center shadow hover:bg-purple-50 transition"
          >
            <div className="text-4xl mb-2">📩</div>
            <h2 className="font-semibold text-lg text-purple-600">OTP via Email</h2>
            <p className="text-sm text-gray-600 mt-2">We&apos;ll send a code to your email.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
