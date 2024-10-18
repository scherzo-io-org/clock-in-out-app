'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation
import BackButton from '@/components/BackButton';

export default function EmployeeWelcome() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [employee, setEmployee] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const [nextAction, setNextAction] = useState('in');

  useEffect(() => {
    // Fetch employee details and last action
    const fetchData = async () => {
      const resEmployee = await fetch(`/api/get-employee?id=${id}`);
      const dataEmployee = await resEmployee.json();
      console.log(dataEmployee)
      if (!dataEmployee.success) {
        alert('Employee not found.');
        router.push('/');
        return;
      }
      setEmployee(dataEmployee.employee);

      const resLastAction = await fetch(`/api/get-last-action?id=${id}`);
      const dataLastAction = await resLastAction.json();
      console.log(dataLastAction)
      if (dataLastAction.lastAction) {
        setLastAction(dataLastAction.lastAction);
        setNextAction(dataLastAction.lastAction.type === 'in' ? 'out' : 'in');
      } else {
        setNextAction('in');
      }
    };
    fetchData();
  }, [id, router]);

  const handleActionClick = () => {
    router.push(`/employee/${id}/camera?action=${nextAction}`);
  };

  if (!employee) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const actionText = nextAction === 'in' ? 'CLOCK IN' : 'CLOCK OUT';

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {/* Back Button */}
      <BackButton href="/" />

      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Welcome back, {employee.first_name}
        </h1>
        {lastAction ? (
          <p className="mb-6 text-lg text-gray-700">
            Last action: <span className="font-semibold">Clock-{lastAction.type}</span> at{' '}
            {new Date(lastAction.timestamp_in).toLocaleString()}
          </p>
        ) : (
          <p className="mb-6 text-lg text-gray-700">No previous actions recorded.</p>
        )}
        <button
          onClick={handleActionClick}
          className={`w-full py-4 text-xl font-medium rounded-lg shadow-md transition ${
            nextAction === 'in'
              ? 'bg-secondary text-white hover:bg-secondary-dark'
              : 'bg-accent text-white hover:bg-red-600'
          }`}
        >
          {actionText}
        </button>
      </div>
    </div>
  );
}
