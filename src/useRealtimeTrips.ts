'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '../firebase';

interface Trip {
  id: string;
  ownerId: string;
  createdAt: any;
  [key: string]: any;
}

export function useRealtimeTrips(userId: string) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Get firestore from existing getSdks pattern
    const { firestore } = initializeFirebase();

    import('firebase/firestore').then(({
      collection,
      onSnapshot,
      query,
      where,
      orderBy
    }) => {
      const tripsRef = collection(firestore, 'trips');
      const q = query(
        tripsRef,
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      // Real-time Firestore listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const tripsData: Trip[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data() as Omit<Trip, 'id'>,
          }));
          setTrips(tripsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('[useRealtimeTrips] error:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    });
  }, [userId]);

  return { trips, loading, error };
}
