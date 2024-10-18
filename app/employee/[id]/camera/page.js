'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

export default function CameraCapture() {
  const videoRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const action = searchParams.get('action'); // 'in' or 'out'

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch employee details
    const fetchEmployee = async () => {
      const resEmployee = await fetch(`/api/get-employee?id=${id}`);
      const dataEmployee = await resEmployee.json();
      if (!dataEmployee.success) {
        alert('Employee not found.');
        router.push('/');
        return;
      }
      setEmployee(dataEmployee.employee);
    };
    fetchEmployee();

    // Access camera
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        alert('Camera access denied or unavailable.');
        router.push('/');
      });
  }, [id, router]);

  const handleCapture = async () => {
    setLoading(true);

    // Capture image from video stream
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    console.log(imageData)

    // Mock image upload and get URL
    const imageUrl = await uploadImage(imageData);

    // Save record to database via API
    const response = await fetch('/api/save-record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, action, imageUrl }),
    });

    const data = await response.json();

    if (data.success) {
      // Stop the camera stream
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());

      // Redirect to confirmation page
      router.push(
        `/employee/${id}/confirmation?action=${action}&imageUrl=${encodeURIComponent(
          imageUrl
        )}&name=${encodeURIComponent(employee.first_name)}`
      );
    } else {
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Mock image upload function
  const uploadImage = async (imageData) => {
    // For now, we'll just return the data URL
    // In a real app, you'd upload to storage and get the URL
    return 'https://i.ytimg.com/vi/hAsZCTL__lo/mqdefault.jpg';
  };

  if (!employee) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <video
        ref={videoRef}
        autoPlay
        className="w-full h-auto bg-black mb-4"
        style={{ maxHeight: '80vh' }}
      ></video>
      {loading ? (
        <div className="text-xl">Processing...</div>
      ) : (
        <button
          onClick={handleCapture}
          className="w-full py-6 bg-blue-500 text-white rounded-lg text-2xl"
        >
          Take Photo
        </button>
      )}
    </div>
  );
}
