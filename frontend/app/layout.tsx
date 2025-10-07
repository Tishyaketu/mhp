// frontend/app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Providers } from './providers';
export const metadata: Metadata = {
  title: 'Movie Search',
  description: 'Search and save your favorite movies',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
        <nav className="bg-blue-600 text-white p-4 sticky top-0 z-50 shadow-md">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-bold text-lg sm:text-xl">
                🎬 Movie Search
              </Link>
              <div className="flex gap-3 sm:gap-6">
                <Link href="/" className="hover:underline text-sm sm:text-base">
                  Search
                </Link>
                <Link href="/favorites" className="hover:underline text-sm sm:text-base">
                  Favorites
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-3 sm:p-4 md:p-6 max-w-7xl">
          {children}
        </main>
        </Providers>
      </body>
    </html>
  );
}