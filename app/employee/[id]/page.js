'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EmployeeContext } from '@/app/EmployeeContext';
// import Link from 'next/link'; // Import Link for navigation
import BackButton from '@/components/BackButton';

export default function EmployeeWelcome() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { employeeData, setEmployeeData } = useContext(EmployeeContext);
  //const [employee, setEmployee] = useState(null);

  const [lastAction, setLastAction] = useState(null);
  const [nextAction, setNextAction] = useState('in');

  useEffect(() => {
    // If employee data isn't in context, fetch it
    if (!employeeData) {
      const fetchEmployee = async () => {
        const resEmployee = await fetch(`/api/get-employee?id=${id}`);
        const dataEmployee = await resEmployee.json();
        if (!dataEmployee.success) {
          alert('Employee not found.');
          router.push('/');
          return;
        }
        // Update employee data in context
        setEmployeeData(dataEmployee.employee);
      };
      fetchEmployee();
    }

    // Fetch last action
    const fetchLastAction = async () => {
      const resLastAction = await fetch(`/api/get-last-action?rep=${employeeData.LoginID}`);
      const dataLastAction = await resLastAction.json();
      if (dataLastAction.lastAction) {
        setLastAction(dataLastAction.lastAction);
        setNextAction(dataLastAction.lastAction.type === 'in' ? 'out' : 'in');
      } else {
        setNextAction('in');
      }
    };
    fetchLastAction();
  }, [id, router, employeeData, setEmployeeData]);

  const handleActionClick = () => {
    router.push(`/employee/${id}/camera?action=${nextAction}`);
  };

  if (!employeeData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const actionText = nextAction === 'in' ? 'CLOCK IN' : 'CLOCK OUT';

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {/* Back Button */}
      <BackButton href="/" />

      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Welcome back, {employeeData.FirstName}
        </h1>
        {lastAction ? (
          <p className="mb-6 text-lg text-gray-700">
            Last action: <span className="font-semibold">Clock-{lastAction.type}</span> at{' '}
            {new Date(new Date(lastAction.timestamp_in).getTime() + 5 * 3600000).toLocaleString()}
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
