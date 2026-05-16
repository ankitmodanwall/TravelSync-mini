'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useAuth } from '@/context/auth-context';
import { collection, query, where } from 'firebase/firestore';
import type { Trip } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Landmark, Wallet } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';

function BudgetListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-1/4 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function BudgetPage() {
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

  const { data: trips, isLoading, error } = useCollection<Trip>(tripsQuery);
  
  // In a real app, you would fetch budget items for each trip
  const expenses = 0; 
  
  if (isLoading) {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-headline font-bold flex items-center gap-3">
                <Landmark />
                Trip Budgets
                </h1>
                <p className="text-muted-foreground">
                Manage your spending for your upcoming adventures.
                </p>
            </div>
            <BudgetListSkeleton />
        </div>
    )
  }

  if (error) {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-headline font-bold flex items-center gap-3">
                <Landmark />
                Trip Budgets
                </h1>
                <p className="text-muted-foreground">
                Manage your spending for your upcoming adventures.
                </p>
            </div>
            <ErrorState 
                title="Couldn't load budgets"
                message="There was an error fetching your trip budgets. Please try again."
                onRetry={() => window.location.reload()}
            />
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-headline font-bold flex items-center gap-3">
          <Landmark />
          Trip Budgets
        </h1>
        <p className="text-muted-foreground">
          Manage your spending for your upcoming adventures.
        </p>
      </div>
      
      <div className="space-y-6">
        {trips && trips.length > 0 ? (
          trips.map(trip => {
              const budget = trip.budget || 0;
              const spent = expenses; // placeholder
              const progress = budget > 0 ? (spent / budget) * 100 : 0;
              const remaining = budget - spent;

              return (
                  <Link href={`/trips/${trip.id}`} key={trip.id} className="group block">
                      <Card className="hover:border-primary/50 transition-colors">
                          <CardHeader>
                              <CardTitle className="group-hover:text-primary transition-colors">{trip.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{trip.destination}</p>
                          </CardHeader>
                          <CardContent>
                              <div className="space-y-2">
                                  <div className="flex justify-between text-sm font-medium">
                                      <span>Spent: ${spent.toLocaleString()}</span>
                                      <span className="text-muted-foreground">Total: ${budget.toLocaleString()}</span>
                                  </div>
                                  <Progress value={progress} />
                                  <div className="text-right text-sm text-muted-foreground">
                                      ${remaining.toLocaleString()} remaining
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  </Link>
              )
          })
        ) : (
          <EmptyState
            icon={Wallet}
            title="No budgets yet"
            description="You have no trips with budgets. Create a new trip to start tracking expenses."
            actionLabel="New Trip"
            actionHref="/trips/new"
          />
        )}
      </div>
    </div>
  );
}
