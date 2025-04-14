'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DuoAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      alert('❌ Missing Duo token. Please try logging in again.');
      return;
    }

    localStorage.setItem('token', token);
    router.push('/student/dashboard');
  }, [token, router]);

  return (
    <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-red-600">
      {token ? '✅ Duo Authentication Successful. Redirecting...' : '❌ Missing Duo token. Please try logging in again.'}
    </div>
  );
}
