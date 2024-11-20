// components/HomeButton.js

'use client';

import { useRouter } from 'next/navigation';
import { HomeIcon } from '@heroicons/react/24/solid'; // Update the import path

export default function HomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="absolute top-4 left-4 flex items-center text-gray-500 hover:text-primary transition"
      aria-label="Go to home page"
    >
      <HomeIcon className="h-6 w-6" />
    </button>
  );
}
