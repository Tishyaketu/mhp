// frontend/app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Providers } from './providers';
export const metadata: Metadata = {
  title: 'Movie Search',
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
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex gap-8">
            <Link href="/" className="font-bold">Movie Search</Link>
            <Link href="/" className="hover:underline">Search</Link>
            <Link href="/favorites" className="hover:underline">Favorites</Link>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
        </Providers>
      </body>
    </html>
  );
}