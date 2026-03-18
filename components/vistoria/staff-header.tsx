'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { User } from '@/lib/types';
import { getInitials } from '@/lib/mocks';

interface StaffHeaderProps {
  user: User;
  onLogout: () => void;
}

export function StaffHeader({ user, onLogout }: StaffHeaderProps) {
  // Saudação baseada na hora do dia
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const firstName = user.nome.split(' ')[0];

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary-foreground/20">
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-semibold">
                {getInitials(user.nome)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-primary-foreground/70 text-sm">{getGreeting()},</p>
              <p className="text-xl font-bold">{firstName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Curved bottom edge */}
      <div className="h-6 bg-background rounded-t-3xl" />
    </header>
  );
}
