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
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6 text-primary">
            Thank you, {decodeURIComponent(name)}!
          </h1>
          {imageUrl && (
            <div className="mb-6">
              <img
                src={decodeURIComponent(imageUrl)}
                alt="Your Photo"
                className="w-64 h-64 object-cover rounded-lg mx-auto shadow-md"
              />
            </div>
          )}
          <p className="text-xl mb-6 text-gray-700">{message}</p>
          <p className="text-gray-500">Redirecting to the main page...</p>
        </div>
      </div>
    );
}
