'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Zap,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  PlusCircle,
} from 'lucide-react';

export function AppNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/new', label: 'New Application', icon: PlusCircle },
    { href: '/app/invoices', label: 'Invoices', icon: FileText },
    { href: '/app/reports', label: 'Reports', icon: BarChart3 },
    { href: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">Energetic Goose</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn('gap-2', isActive && 'bg-secondary')}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium">{session?.user?.name || session?.user?.email}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.orgName}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
