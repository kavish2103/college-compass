import AuthProvider from '@/components/SessionProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CompareProvider } from '@/components/colleges/CompareContext';
import CompareFloatingBar from '@/components/colleges/CompareFloatingBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CompareProvider>
        <div className="flex min-h-screen flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <CompareFloatingBar />
          <Footer />
        </div>
      </CompareProvider>
    </AuthProvider>
  );
}
