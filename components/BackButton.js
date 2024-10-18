// components/BackButton.js

'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ href = '/' }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="absolute top-4 left-4 flex items-center text-gray-500 hover:text-primary transition"
      aria-label="Go back"
    >
      <svg
        className="h-6 w-6 mr-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
