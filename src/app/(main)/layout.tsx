import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropertyProvider } from '@/context/PropertyContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PropertyProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
    </PropertyProvider>
  );
}
