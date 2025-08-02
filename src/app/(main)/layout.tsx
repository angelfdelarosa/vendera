import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { AutoLogoutProvider } from '@/components/auth/AutoLogoutProvider';
import { AuthRedirect } from '@/components/auth/AuthRedirect';
import { getIdleTimeConfig } from '@/config/auth';

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
        <div className="flex flex-col min-h-screen overflow-x-hidden">
          <Header />
          <main className="flex-grow w-full pb-20 lg:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </div>
      </AuthRedirect>
    </AutoLogoutProvider>
  );
}
