
"use client";

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/common/Header';
import { cn } from '@/lib/utils';
import { SplashScreen } from '@/components/common/SplashScreen';

// Note: Metadata can't be exported from a client component.
// We can move it to a server component or handle it differently if needed.
// For now, we keep it but it might not work as expected in a "use client" file.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="fr">
      <head>
        <title>Schola Ludus</title>
        <meta name="description" content="Embed and track your Genially presentations" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        {isLoading ? (
          <SplashScreen />
        ) : (
          <>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <Toaster />
          </>
        )}
      </body>
    </html>
  );
}
