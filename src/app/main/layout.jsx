import Navbar from '@/app/main/components/Navbar';
import Footer from '@/app/main/components/Footer';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-128px)]">
        {children}
      </main>
      <Footer />
    </>
  );
}
