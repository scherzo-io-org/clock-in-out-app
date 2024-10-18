'use client';

import { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

export default function Confirmation() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const action = searchParams.get('action'); // 'in' or 'out'
  const imageUrl = searchParams.get('imageUrl');

  useEffect(() => {
    // Redirect to the main page after a few seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  const message =
    action === 'in' ? 'Have a great shift!' : 'Enjoy your time off!';

    const name = searchParams.get('name');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Thank you, {name}!</h1>
      {imageUrl && (
        <img
          src={decodeURIComponent(imageUrl)}
          alt="Your Photo"
          className="w-64 h-auto mb-4 rounded-lg"
        />
      )}
      <p className="text-xl mb-4">{message}</p>
      <p className="text-gray-600">Redirecting to the main page...</p>
    </div>
  );
}
