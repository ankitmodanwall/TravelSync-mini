'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import type { Trip } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

/* ---------------- Skeleton ---------------- */

function UpdatesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ---------------- Collaborators ---------------- */

function CollaboratorAvatars({ ids }: { ids: string[] }) {
  const firestore = useFirestore();

  const profilesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'userProfiles') : null),
    [firestore]
  );

  const profilesQuery = useMemoFirebase(
    () =>
      profilesRef && ids.length > 0
        ? query(profilesRef, where('id', 'in', ids))
        : null,
    [profilesRef, ids]
  );

  const { data: collaborators } = useCollection<User>(profilesQuery);

  return (
    <TooltipProvider>
      <div className="flex -space-x-2 overflow-hidden">
        {collaborators?.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={c.photoURL || ''} alt={c.name || ''} />
                  <AvatarFallback>
                    {c.name
                      ? c.name.charAt(0)
                      : c.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{c.name || c.email}</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
      </div>
    </TooltipProvider>
  );
}

/* ---------------- Trip Card ---------------- */

function TripUpdateCard({ trip, index }: { trip: Trip; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={`/trips/${trip.id}`} className="group block">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="group-hover:text-primary transition-colors">
              {trip.name}
            </CardTitle>

            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {trip.destination}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Your trip starts tomorrow!
              </p>

              {trip.collaboratorIds && (
                <CollaboratorAvatars ids={trip.collaboratorIds} />
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

/* ---------------- Page ---------------- */

export default function UpdatesPage() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const tripsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'trips') : null),
    [firestore]
  );

  const tripsQuery = useMemoFirebase(
    () =>
      tripsRef && user
        ? query(tripsRef, where('collaboratorIds', 'array-contains', user.uid))
        : null,
    [tripsRef, user]
  );

  const { data: trips, isLoading } = useCollection<Trip>(tripsQuery);

  const upcomingTrips = useMemo(() => {
    if (!trips) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimestamp = Timestamp.fromDate(tomorrow);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    const dayAfterTomorrowTimestamp = Timestamp.fromDate(dayAfterTomorrow);

    return trips.filter(
      trip =>
        trip.startDate.seconds >= tomorrowTimestamp.seconds &&
        trip.startDate.seconds < dayAfterTomorrowTimestamp.seconds
    );
  }, [trips]);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* HEADER */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-headline font-bold flex items-center gap-3">
          <CalendarCheck />
          Next-Day Updates
        </h1>

        <p className="text-muted-foreground">
          Here are your trips that are starting tomorrow. Get ready!
        </p>
      </motion.div>

      {/* CONTENT */}
      {isLoading ? (
        <UpdatesSkeleton />
      ) : (
        <div className="space-y-6">
          {upcomingTrips.length > 0 ? (
            upcomingTrips.map((trip, index) => (
              <TripUpdateCard
                key={trip.id}
                trip={trip}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">
                    You have no trips starting tomorrow.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}