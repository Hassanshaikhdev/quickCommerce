import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import Navigation from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuickCommerce - Instant Grocery Delivery',
  description: 'Order groceries and household items with lightning-fast delivery. Powered by AI for seamless shopping experience.',
  keywords: 'grocery delivery, quick commerce, instant delivery, online grocery, AI shopping',
  authors: [{ name: 'QuickCommerce Team' }],
  creator: 'QuickCommerce',
  publisher: 'QuickCommerce',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://quickcommerce.com'),
  openGraph: {
    title: 'QuickCommerce - Instant Grocery Delivery',
    description: 'Order groceries and household items with lightning-fast delivery.',
    url: 'https://quickcommerce.com',
    siteName: 'QuickCommerce',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'QuickCommerce - Instant Grocery Delivery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickCommerce - Instant Grocery Delivery',
    description: 'Order groceries and household items with lightning-fast delivery.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
} 