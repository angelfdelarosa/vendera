'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { AutoLogoutProvider } from '@/components/auth/AutoLogoutProvider';
import { AuthRedirect } from '@/components/auth/AuthRedirect';
import { NavigationDebugger } from '@/components/debug/NavigationDebugger';
import { getIdleTimeConfig } from '@/config/auth';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';

// Componente de cliente para manejar el padding dinámico
function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  // Aplicamos padding inferior solo si el usuario está autenticado (para el BottomNav en móvil)
  const mainPaddingClass = user ? "pb-20 lg:pb-0" : "pb-0";
  
  // Check if we need to show navigation debugger
  const debugProfile = searchParams?.get('debug_profile');
  const expectedPath = debugProfile ? `/profile/${debugProfile}` : undefined;
  
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className={`flex-grow w-full ${mainPaddingClass}`}>{children}</main>
      <Footer />
      <BottomNav />
      {debugProfile && (
        <NavigationDebugger 
          expectedPath={expectedPath}
          userId={debugProfile}
        />
      )}
    </div>
  );
}

// Componente de layout principal
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { idleTime, warningTime } = getIdleTimeConfig();
  
  return (
    <AutoLogoutProvider
      idleTime={idleTime}
      warningTime={warningTime}
      enabled={true}
    >
      <AuthRedirect>
        <MainLayoutContent>
          {children}
        </MainLayoutContent>
      </AuthRedirect>
    </AutoLogoutProvider>
  );
}
