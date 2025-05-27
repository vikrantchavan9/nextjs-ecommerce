import { Suspense } from 'react';
import LoginPage from './LoginClient'; // This file

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
