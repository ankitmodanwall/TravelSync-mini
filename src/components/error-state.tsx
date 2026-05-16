'use client';

import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while fetching your data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 backdrop-blur-sm p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 shadow-inner">
        <AlertCircle className="h-10 w-10 text-destructive/80" />
      </div>
      <h3 className="mt-6 text-2xl font-headline font-bold text-destructive/90">{title}</h3>
      <p className="mt-2 mb-8 max-w-sm text-muted-foreground leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="flex items-center gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
