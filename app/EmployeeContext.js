'use client';

import { createContext, useState } from 'react';

export const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
  const [employeeData, setEmployeeData] = useState(null);

  return (
    <EmployeeContext.Provider value={{ employeeData, setEmployeeData }}>
      {children}
    </EmployeeContext.Provider>
  );
}
