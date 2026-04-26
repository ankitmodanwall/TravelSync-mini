'use client';
import { TripCard } from './trip-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Trip } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useMemo } from 'react';

function TripListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TripList() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const tripsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'trips') : null),
    [firestore]
  );
  
  const tripsQuery = useMemoFirebase(
    () =>
      tripsRef && user
        ? query(
            tripsRef,
            where('collaboratorIds', 'array-contains', user.uid)
          )
        : null,
    [tripsRef, user]
  );

  const {
    data: trips,
    isLoading,
  } = useCollection<Trip>(tripsQuery);


  if (isLoading) {
    return <TripListSkeleton />;
  }

  if (!trips || trips.length === 0) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No trips yet!</AlertTitle>
        <AlertDescription>
          You haven&apos;t created any trips or been invited to any. Click &quot;New
          Trip&quot; to start planning your next adventure.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {trips.map((trip, i) => (
        <div 
          key={trip.id}
          className="animate-in fade-in zoom-in-95 duration-500"
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
        >
          <TripCard trip={trip} />
        </div>
      ))}
    </div>
  );
}
