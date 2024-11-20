'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { EmployeeContext } from './EmployeeContext';


export default function EmployeeIDEntry() {
  const [employeeID, setEmployeeID] = useState('');
  const router = useRouter();
  const { setEmployeeData } = useContext(EmployeeContext);


  const handleNumClick = (num) => {
    console.log('Number clicked:', num);
    setEmployeeID((prev) => prev + num);
  };

  const handleBackspace = () => {
    console.log('Clear clicked');
    setEmployeeID((prev) => '');
  };

  const handleSubmit = async () => {
    // Call API to validate employee ID
    const response = await fetch(`/api/validate-employee?id=${employeeID}`);
    const data = await response.json();
    if (data.valid) {
      setEmployeeData(data.employee);
      router.push(`/employee/${employeeID}`);
    } else {
      alert(data.reason);
      setEmployeeID('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-4xl font-bold mb-8 text-primary">Welcome</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          value={employeeID}
          readOnly
          className="w-full text-center text-3xl mb-6 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', 'Enter'].map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === 'Clear') handleBackspace();
                else if (item === 'Enter') handleSubmit();
                else handleNumClick(item);
              }}
              className={`w-full py-4 text-xl font-medium rounded-lg transition ${
                item === 'Enter'
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : item === 'Clear'
                  ? 'bg-gray-200 text-text hover:bg-gray-300'
                  : 'bg-white text-text hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
