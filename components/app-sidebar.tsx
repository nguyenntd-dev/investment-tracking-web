'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Coins, Gem, Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';

const menuItems = [
  {
    href: '/gold',
    label: 'Vàng',
    description: 'Theo dõi biến động kim loại quý',
    icon: Gem,
  },
  {
    href: '/fund-certificates',
    label: 'Chứng chỉ quỹ',
    description: 'Quản lý danh mục quỹ mở và ETF',
    icon: Coins,
  },
];

type AppSidebarProps = {
  isDesktopOpen: boolean;
  onDesktopToggle: () => void;
};

export function AppSidebar({ isDesktopOpen, onDesktopToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <div className="border-sidebar-border bg-sidebar/92 supports-[backdrop-filter]:bg-sidebar/75 sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 backdrop-blur md:hidden">
        <div>
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.28em]">
            Investment Tracker
          </p>
          <p className="text-sidebar-foreground mt-1 text-sm font-semibold tracking-tight">Danh mục đầu tư</p>
        </div>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-sidebar-menu"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsOpen((open) => !open)}
          className="border-sidebar-border bg-background/80 text-sidebar-foreground inline-flex size-11 items-center justify-center rounded-2xl border transition hover:bg-white"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#1a1712]/40 transition-opacity duration-300 md:hidden',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-sidebar-menu"
        className={cn(
          'border-sidebar-border bg-sidebar/95 supports-[backdrop-filter]:bg-sidebar/80 fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm shrink-0 flex-col border-r backdrop-blur transition-all duration-300 md:static md:z-auto md:max-w-none md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isDesktopOpen ? 'md:w-80 md:opacity-100' : 'md:w-[5.5rem] md:opacity-100',
        )}
      >
        <div className="border-sidebar-border border-b px-5 py-5 md:px-6 md:py-7">
          <div className="flex items-start justify-between gap-4">
            <div className={cn('min-w-0', !isDesktopOpen && 'md:hidden')}>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.28em]">
                Investment Tracker
              </p>
              <div className="mt-3 space-y-2">
                <h1 className="text-sidebar-foreground text-2xl font-semibold tracking-tight">
                  Danh mục đầu tư
                </h1>
                <p className="text-muted-foreground max-w-xs text-sm leading-6">
                  Chọn một nhóm tài sản để theo dõi nhanh hiệu suất và diễn biến gần nhất.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label={
                isDesktopOpen
                  ? 'Collapse sidebar menu'
                  : 'Expand sidebar menu'
              }
              aria-expanded={isDesktopOpen}
              onClick={() => {
                if (window.innerWidth >= 768) {
                  onDesktopToggle();
                  return;
                }

                setIsOpen(false);
              }}
              className="border-sidebar-border bg-background/80 text-sidebar-foreground inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border transition hover:bg-white"
            >
              <span className="md:hidden">
                <X className="size-4.5" />
              </span>
              <span className="hidden md:inline">
                {isDesktopOpen ? <ChevronLeft className="size-4.5" /> : <ChevronRight className="size-4.5" />}
              </span>
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-3 overflow-y-auto px-4 py-4 md:flex-1 md:overflow-visible md:px-4 md:py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'group border-sidebar-border/70 relative block w-full rounded-3xl border px-4 py-4 transition-all duration-200',
                  'hover:border-[#c89b3c]/45 hover:bg-[#fff8eb] hover:shadow-[0_14px_40px_-28px_rgba(200,155,60,0.75)]',
                  isActive && 'border-[#c89b3c]/55 bg-[#fff8eb] shadow-[0_20px_45px_-30px_rgba(200,155,60,0.85)]',
                  !isDesktopOpen && 'md:px-0 md:py-0 md:border-transparent md:bg-transparent md:shadow-none md:hover:border-transparent md:hover:bg-transparent md:hover:shadow-none',
                )}
                title={!isDesktopOpen ? item.label : undefined}
              >
                <div
                  className={cn(
                    'flex items-start gap-3',
                    !isDesktopOpen && 'md:flex-col md:items-center md:justify-center md:gap-0 md:px-0 md:py-3',
                  )}
                >
                  <div
                    className={cn(
                      'flex size-11 items-center justify-center rounded-2xl border transition-colors duration-200',
                      isActive
                        ? 'border-[#d2a649] bg-[#1a1712] text-[#f8d37b]'
                        : 'border-sidebar-border bg-background text-muted-foreground group-hover:border-[#e1c489] group-hover:text-[#9b6c12]',
                      !isDesktopOpen && 'md:size-12',
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className={cn('min-w-0', !isDesktopOpen && 'md:hidden')}>
                    <p className="text-sidebar-foreground text-base font-semibold tracking-tight">{item.label}</p>
                    <p className="text-muted-foreground mt-1 text-sm leading-5">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
