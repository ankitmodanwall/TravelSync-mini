'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { LoadingState } from '@/components/loading-state';

const PUBLIC_ROUTES = ['/', '/login', '/signup'];

export function AuthRedirect({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = ['/login', '/signup', '/'].includes(pathname);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user && isAuthRoute) {
      router.replace('/dashboard');
    } else if (!user && !isPublicRoute) {
      router.replace('/');
    }
  }, [user, loading, router, pathname, isAuthRoute, isPublicRoute]);

  // While loading, or if redirection is about to happen, don't render children
  if (loading || (user && isAuthRoute) || (!user && !isPublicRoute)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
           <p className="text-sm text-muted-foreground animate-pulse">Loading TravelSync...</p>
        </div>
      </div>
    );
  if (loading || (user && isAuthRoute) || (!user && isProtectedRoute)) {
    return <LoadingState message="Authenticating..." className="h-screen w-full" />;
  }

  // If no redirection is needed, render the page content
  return <>{children}</>;
}
