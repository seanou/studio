'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BookOpenText, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/history', label: 'Historique', icon: BookOpenText },
  ];

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-wider font-headline">
            <Image 
              src="https://i.ibb.co/1Wr1PtX/image-removebg-preview-47.png" 
              alt="Schola Ludus Logo" 
              width={50} 
              height={50} 
              className="h-12 w-auto"
            />
            <span className="hidden sm:inline">Schola Ludus</span>
          </Link>
          <nav>
            <ul className="flex items-center space-x-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 text-lg font-medium transition-colors hover:text-accent',
                      pathname === item.href ? 'text-accent' : 'text-primary-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className='hidden md:inline'>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
