import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'NAW Games - Nolan, Addie & Wyatt\'s Game Arcade',
  description: 'Play awesome games made by Nolan, Addie, and Wyatt! Request your own custom game too.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
