import Link from 'next/link';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserNav } from './user-nav';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import type { ReactNode } from 'react';


export default function Header({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-6',
        'border-border/50 bg-background/95 backdrop-blur-md shadow-sm'
      )}
    >
      {children}
      
      <div className="flex w-full items-center justify-end gap-2 md:gap-4">
        <Button
          asChild
          size="sm"
          className="bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300 text-white transition-all duration-300 ease-in-out hover:from-indigo-600 hover:to-cyan-400 hover:shadow-lg"
        >
          <Link href="/trips/new">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Trip</span>
          </Link>
        </Button>
        <ThemeToggle />
        { user && <UserNav user={user} /> }
      </div>
    </header>
  );
}
