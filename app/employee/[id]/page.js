// app/employee/[id]/page.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome back, {employee.first_name}</h1>
      {lastAction ? (
        <p className="mb-6">
          Last action: Clock-{lastAction.type} at{' '}
          {new Date(lastAction.timestamp_in).toLocaleString('en-US', {timeZone : 'America/New_York'})}
        </p>
      ) : (
        <p className="mb-6">No previous actions recorded.</p>
      )}
      <button
        onClick={handleActionClick}
        className={`w-full py-6 text-white rounded-lg text-2xl ${
          nextAction === 'in' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {actionText}
      </button>
    </div>
  );
}
