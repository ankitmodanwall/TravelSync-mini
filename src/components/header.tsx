import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import type { ReactNode } from 'react';


export default function Header({ children }: { children?: ReactNode }) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-6',
        'border-border/50 bg-background/95 backdrop-blur-md shadow-sm'
      )}
    >
      {children}
      
      <div className="flex w-full items-center justify-end gap-2 md:gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
