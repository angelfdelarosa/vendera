'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Plus, MessageCircle, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: t('header.home'),
      isActive: pathname === '/',
    },
    {
      href: '/favorites',
      icon: Heart,
      label: t('header.favorites'),
      isActive: pathname === '/favorites',
    },
    {
      href: '/properties/new',
      icon: Plus,
      label: t('header.addProperty'),
      isActive: pathname === '/properties/new',
    },
    {
      href: '/messages',
      icon: MessageCircle,
      label: t('header.messages'),
      isActive: pathname === '/messages',
    },
    {
      href: '/profile',
      icon: User,
      label: t('header.profile'),
      isActive: pathname.startsWith('/profile'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-colors',
                item.isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon 
                className={cn(
                  'h-5 w-5 mb-1',
                  item.isActive ? 'text-primary' : 'text-muted-foreground'
                )} 
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}