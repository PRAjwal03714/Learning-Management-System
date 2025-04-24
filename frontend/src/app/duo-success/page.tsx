// app/duo-success/page.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function DuoCallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const duo_code = params.get('duo_code');
    const state = params.get('state');

    if (token) {
      // If we have a token directly, use it and redirect
      localStorage.setItem('token', token);
      router.push('/student/dashboard');
    } else if (duo_code && state) {
      // If we have duo_code and state, verify with backend
      const verifyDuo = async () => {
        try {
          const res = await fetch(`${baseUrl}/api/auth/duo/callback?duo_code=${duo_code}&state=${state}`);
          const data = await res.json();

          if (res.ok && data.token) {
            localStorage.setItem('token', data.token);
            router.push('/student/dashboard');
          } else {
            alert('Duo verification failed. Please try again.');
            router.push('/student/login');
          }
        } catch (err) {
          console.error('Duo verification error:', err);
          alert('An error occurred during Duo verification. Please try again.');
          router.push('/student/login');
        }
      };
      verifyDuo();
    } else {
      alert('Missing authentication parameters. Please try logging in again.');
      router.push('/student/login');
    }
  }, [params, router]);

  return <p className="text-center mt-10">Verifying Duo authentication...</p>;
}
