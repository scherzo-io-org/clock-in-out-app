'use client';

import { useEffect, useRef, useState, useContext } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { EmployeeContext } from '@/app/EmployeeContext';


export default function CameraCapture() {
  const videoRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const action = searchParams.get('action'); // 'in' or 'out'

  const { employeeData, setEmployeeData } = useContext(EmployeeContext);
  // const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Access camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          alert('Camera access denied or unavailable.');
          router.push('/');
        });
    } else {
      alert('Camera is not supported on this device or browser.');
      router.push('/');
    }
  }, [id, router, employeeData, setEmployeeData]);

  const handleCapture = async () => {
    setLoading(true);

    // Capture image from video stream
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    try {
      const imageUrl = await uploadImage(imageData);

      // Save record to database via API
      const response = await fetch('/api/save-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id : employeeData.LoginID, action, imageUrl }),
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
          )}&name=${encodeURIComponent(employeeData.FirstName)}`
        );
      } else {
        alert('An error occurred 1. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during handleCapture:', error);
      alert('An error occurred 2. Please try again.');
      setLoading(false);
    }
  };

  const uploadImage = async (imageData) => {
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Return the image URL returned by the server
        return data.imageUrl;
      } else {
        console.error('Error uploading image:', data.error);
        throw new Error(data.error || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  };
  

  if (!employeeData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4">

      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-primary">
          {action === 'in' ? 'Clock In' : 'Clock Out'}
        </h1>
        <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden mb-6">
          <video
            ref={videoRef}
            autoPlay
            className="absolute top-0 left-0 w-full h-full object-cover"
          ></video>
        </div>
        {loading ? (
          <button
            disabled
            className="w-full py-4 text-xl font-medium rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            Processing...
          </button>
        ) : (
          <button
            onClick={handleCapture}
            className="w-full py-4 text-xl font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition"
          >
            Take Photo
          </button>
        )}
      </div>
    </div>
  );
}
