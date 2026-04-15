'use client';

import { useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { cn } from '@/lib/utils';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  return (
    <div
      className={cn(
        'min-h-screen md:grid md:transition-[grid-template-columns] md:duration-300',
        isDesktopSidebarOpen ? 'md:grid-cols-[20rem_minmax(0,1fr)]' : 'md:grid-cols-[5.5rem_minmax(0,1fr)]',
      )}
    >
      <AppSidebar
        isDesktopOpen={isDesktopSidebarOpen}
        onDesktopToggle={() => setIsDesktopSidebarOpen((open) => !open)}
      />
      <main className="relative min-w-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(210,166,73,0.2),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.55),_rgba(255,255,255,0.9))]" />
        <div className="relative min-h-screen">{children}</div>
      </main>
    </div>
  );
}
