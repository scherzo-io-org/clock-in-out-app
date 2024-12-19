'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EmployeeContext } from '@/app/EmployeeContext';
import { DateTime } from 'luxon';

import HomeButton from '@/components/HomeButton';

export default function EmployeeWelcome() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { employeeData, setEmployeeData } = useContext(EmployeeContext);

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
      console.log(dataLastAction.lastAction)
      if (dataLastAction.lastAction) {
        setLastAction(dataLastAction.lastAction);
        const testNextAction = determineNextActionButton({lastActionType : dataLastAction.lastAction.type, lastActionTimestamp : dataLastAction.lastAction.timestamp_in});
        console.log('testNextAction:', testNextAction)
        // setNextAction(dataLastAction.lastAction.type === 'in' ? 'out' : 'in');
        setNextAction(testNextAction);
      } else {
        setNextAction('in');
      }
    };
    fetchLastAction();
  }, [id, router, employeeData, setEmployeeData]);

  const handleActionClick = () => {
    router.push(`/employee/${id}/camera?action=${nextAction}`);
  };

  function getWorkDayStart(dt) {
    // If time is before 2:00 AM, the work day started the previous calendar day at 2:00 AM.
    // Otherwise, it started today at 2:00 AM.
    if (dt.hour < 2) {
      return dt.minus({ days: 1 }).set({ hour: 2, minute: 0, second: 0, millisecond: 0 });
    } else {
      return dt.set({ hour: 2, minute: 0, second: 0, millisecond: 0 });
    }
  }

    /**
   * Determine the next action button ("clock in" or "clock out") based on the last action.
   * @param {Object} options
   * @param {'in'|'out'} options.lastActionType - The last recorded action type.
   * @param {string} options.lastActionTimestamp - The last action timestamp in ISO format, e.g. "2024-12-19T02:38:51.443Z".
   * @param {Date} [options.now=new Date()] - The current time. If not provided, uses system current time.
   * @param {string} [options.timeZone='America/New_York'] - The time zone to consider.
   * @returns {'clock in'|'clock out'}
   */
  function determineNextActionButton({
    lastActionType,
    lastActionTimestamp,
    now = new Date(),
    timeZone = 'America/New_York'
  }) {
    console.log('infunction timestamp:', lastActionTimestamp)
    console.log('infunction lastaction:', lastActionType);
    // Parse the last action timestamp in the given time zone.
    // const lastActionTime = DateTime.fromISO(lastActionTimestamp, { zone: timeZone });
    const lastActionTime = DateTime.fromFormat(
      lastActionTimestamp, 
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", 
      { zone: 'America/New_York' }
    );
    
    if (!lastActionTime.isValid) {
      // If we cannot parse the timestamp, default to "clock in".
      return 'clock in';
    }

    const currentTime = DateTime.fromJSDate(now, { zone: timeZone });

    console.log('currentTime:', currentTime);

    // Determine the start and end of the work day for the last action time.
    const workDayStart = getWorkDayStart(lastActionTime);
    console.log('workDayStart:', workDayStart);

    const workDayEnd = workDayStart.plus({ hours: 24 });
    console.log('workDayEnd:', workDayEnd);

    // Check if the current time is within the same work day.
    const isSameWorkDay = currentTime >= workDayStart && currentTime < workDayEnd;
    console.log('isSameWorkDay:', isSameWorkDay);

    if (isSameWorkDay) {
      // If we're in the same work day, show the opposite action button.
      return lastActionType === 'in' ? 'out' : 'in';
    } else {
      // If it's a new work day, start fresh with "clock in".
      return 'in';
    }
  }

  if (!employeeData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const actionText = nextAction === 'in' ? 'CLOCK IN' : 'CLOCK OUT';

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {/* Back Button */}
      <HomeButton/>

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
          <p className="mb-6 text-lg text-gray-700">No previous actions recorded for today.</p>
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
