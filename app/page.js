'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeIDEntry() {
  const [employeeID, setEmployeeID] = useState('');
  const router = useRouter();

  const handleNumClick = (num) => {
    setEmployeeID((prev) => prev + num);
  };

  const handleBackspace = () => {
    setEmployeeID((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    // Call API to validate employee ID
    const response = await fetch(`/api/validate-employee?id=${employeeID}`);
    const data = await response.json();
    if (data.valid) {
      router.push(`/employee/${employeeID}`);
    } else {
      alert('Invalid Employee ID. Please try again.');
      setEmployeeID('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Enter Your Employee ID</h1>
      <input
        type="text"
        value={employeeID}
        readOnly
        className="w-full text-center text-3xl mb-6 p-4 border-b-4 border-gray-500"
      />
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Back', '0', 'Enter'].map((item) => (
          <button
            key={item}
            onClick={() => {
              if (item === 'Back') handleBackspace();
              else if (item === 'Enter') handleSubmit();
              else handleNumClick(item);
            }}
            className="w-24 h-24 bg-blue-500 text-white text-2xl rounded-full flex items-center justify-center"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
