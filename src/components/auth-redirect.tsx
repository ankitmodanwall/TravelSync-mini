'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { LoadingState } from '@/components/loading-state';

const AUTH_ROUTES = ['/login', '/signup', '/'];
const PROTECTED_ROUTES = ['/dashboard', '/budget', '/trips/new', '/updates'];

export function AuthRedirect({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is complete before doing anything
    }

    if (user && isAuthRoute) {
      router.replace('/dashboard');
    } else if (!user && isProtectedRoute) {
      router.replace('/');
    }
  }, [user, loading, router, pathname, isAuthRoute, isProtectedRoute]);

  // While loading, or if redirection is about to happen, don't render children
  if (loading || (user && isAuthRoute) || (!user && isProtectedRoute)) {
    return <LoadingState message="Authenticating..." className="h-screen w-full" />;
  }

  // If no redirection is needed, render the page content
  return <>{children}</>;
}
