import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <FavoritesProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </FavoritesProvider>
  );
}
