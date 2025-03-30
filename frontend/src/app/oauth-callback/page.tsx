'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } else {
      alert('Missing token from provider');
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-700">
      Redirecting after login...
    </div>
  );
}
