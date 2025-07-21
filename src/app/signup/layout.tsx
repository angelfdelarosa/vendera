import { AuthProvider } from '@/context/AuthContext';
import { Suspense } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Suspense>{children}</Suspense>
    </AuthProvider>
  );
}
