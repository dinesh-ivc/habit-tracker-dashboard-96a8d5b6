'use client';

import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export default function AppBar({ onSidebarToggle, sidebarCollapsed }) {
  const [user, setUser] = useState({ name: 'User Name', email: 'user@example.com' });

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-2 text-xl font-semibold hidden md:block">Habit Tracker</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2 border-b">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}