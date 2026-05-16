'use client';

import { LucideIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/5 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/10 shadow-inner">
        <Icon className="h-10 w-10 text-muted-foreground/60" />
      </div>
      <h3 className="mt-6 text-2xl font-headline font-bold">{title}</h3>
      <p className="mt-2 mb-8 max-w-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <>
          {actionHref ? (
            <Button asChild>
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </>
      )}
    </div>
  );
}
