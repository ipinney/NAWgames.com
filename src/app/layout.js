import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'NAW Games - Nolan, Addie & Wyatt\'s Game Arcade',
  description: 'Play awesome games made by Nolan, Addie, and Wyatt! Request your own custom game too.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/favicon-180.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: 'NAW Games - Nolan, Addie & Wyatt\'s Game Arcade',
    description: 'Play awesome games made by Nolan, Addie, and Wyatt! Request your own custom game too.',
    url: 'https://nawgames.com',
    siteName: 'NAW Games',
    images: [
      {
        url: 'https://nawgames.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NAW Games - Games by Nolan, Addie & Wyatt',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAW Games - Nolan, Addie & Wyatt\'s Game Arcade',
    description: 'Play awesome games made by Nolan, Addie, and Wyatt!',
    images: ['https://nawgames.com/og-image.png'],
  },
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
