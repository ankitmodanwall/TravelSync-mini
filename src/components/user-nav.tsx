'use client';
import { Avatar, AvatarFallback, AvatarImage, Button, Typography } from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { CreditCard, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';


interface UserNavProps {
    user: User;
    isSidebarOpen?: boolean;
}

export function UserNav({ user, isSidebarOpen = true }: UserNavProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
    : user.email?.charAt(0).toUpperCase() || '';

  // Collapsed sidebar / header view
  if (!isSidebarOpen) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar size="default" status="online">
              <AvatarImage src={user.photoURL || ''} alt={user.name || user.email || ''} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
           <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <Typography variant="small" className="font-medium leading-none">{user.name}</Typography>
                <Typography variant="muted" className="leading-none">
                  {user.email}
                </Typography>
              </div>
            </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Expanded sidebar view
  return (
    <div className="flex items-center gap-3">
       <Avatar size="sm" status="online">
          <AvatarImage src={user.photoURL || ''} alt={user.name || user.email || ''} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      <div className={cn("flex flex-col space-y-0.5", !isSidebarOpen && "hidden")}>
        <Typography variant="small" className="font-medium leading-none truncate">{user.name}</Typography>
        <Typography variant="muted" className="text-[10px] leading-none truncate">
          {user.email}
        </Typography>
      </div>
    </div>
  );
}
