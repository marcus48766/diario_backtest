
'use client';

import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className={cn(
        "ml-64 min-h-screen transition-all duration-300",
        className
      )}>
        <div className="container mx-auto max-w-7xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
