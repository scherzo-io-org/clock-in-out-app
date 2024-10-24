'use client';

import { EmployeeProvider } from './EmployeeContext';

export function Providers({ children }) {
  return <EmployeeProvider>{children}</EmployeeProvider>;
}
