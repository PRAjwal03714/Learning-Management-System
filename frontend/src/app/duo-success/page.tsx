// app/duo-success/page.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function DuoCallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const duo_code = params.get('duo_code');
    const state = params.get('state');

    const verifyDuo = async () => {
      const res = await fetch(`http://localhost:5001/api/auth/duo/callback?duo_code=${duo_code}&state=${state}`);
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/stuent/dashboard');
      } else {
        alert('Duo verification failed.');
        router.push('/login');
      }
    };

    if (duo_code && state) {
      verifyDuo();
    }
  }, []);

  return <p className="text-center mt-10">Verifying Duo...</p>;
}
