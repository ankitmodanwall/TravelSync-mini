'use client';

import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "",
}: LoadingStateProps) {
  return (
    <div className={`flex min-h-[400px] flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-muted/30" />
        <div className="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  );
}
