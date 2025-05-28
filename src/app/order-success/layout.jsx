// app/order-success/layout.jsx
'use client'; // This layout must be a client component because it uses Suspense

import { Suspense } from 'react';

export default function OrderSuccessLayout({ children }) {
  return (
    // Wrap the children (which is your page.jsx) in a Suspense boundary
    // You can provide a loading fallback that's shown while the searchParams are hydrating
    <Suspense fallback={<div>Loading order details...</div>}>
      {children}
    </Suspense>
  );
}