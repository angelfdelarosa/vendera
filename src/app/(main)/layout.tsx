import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AutoLogoutProvider } from '@/components/auth/AutoLogoutProvider';
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
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Header />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </div>
    </AutoLogoutProvider>
  );
}
