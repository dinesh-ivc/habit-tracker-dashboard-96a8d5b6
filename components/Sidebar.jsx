'use client';

import { Home, BookOpen, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
];

export default function Sidebar({ collapsed }) {
  const pathname = usePathname();

  return (
    <aside className={`bg-white border-r transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } hidden md:block h-screen fixed left-0 top-16`}>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start ${collapsed ? 'justify-center' : ''}`}
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4 mr-2" />
                {!collapsed && item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}