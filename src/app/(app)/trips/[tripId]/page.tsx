'use client';

import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { Trip, ItineraryDay, Activity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Calendar, MapPin, Sparkles, Clock, Map, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { generateItineraryFromPrompt } from '@/ai/flows/generate-itinerary-from-prompt';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

function TripDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-80 w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.tripId as string;
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const tripRef = useMemoFirebase(
    () => (firestore && tripId ? doc(firestore, 'trips', tripId) : null),
    [firestore, tripId]
  );

  const { data: trip, isLoading } = useDoc<Trip>(tripRef);

  const handleGenerateItinerary = async () => {
    if (!trip || !firestore || !tripRef) return;

    setIsGenerating(true);
    try {
      const duration =
        (trip.endDate.toDate().getTime() -
          trip.startDate.toDate().getTime()) /
          (1000 * 3600 * 24) +
        1;

      const aiResponse = await generateItineraryFromPrompt({
        destination: trip.destination,
        duration: duration,
        tripType: 'leisure',
        budget: trip.budget,
      });

      const itineraryObject = JSON.parse(aiResponse.itinerary);

      await updateDoc(tripRef, {
        itinerary: itineraryObject.itinerary || [],
      });

      toast({
        title: 'Itinerary Generated!',
        description: 'Your AI-powered itinerary has been created.',
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate an itinerary. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <TripDetailSkeleton />;
  if (!trip) return <div>Trip not found.</div>;

  const dateRange =
    trip.startDate && trip.endDate
      ? `${format(trip.startDate.toDate(), 'MMMM dd, yyyy')} to ${format(
          trip.endDate.toDate(),
          'MMMM dd, yyyy'
        )}`
      : 'Date not set';

  return (
    <motion.div
      className="mx-auto max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* HERO */}
      <motion.div
        className="relative mb-8 h-80 w-full overflow-hidden rounded-2xl"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={trip.imageUrl}
          alt={trip.name}
          fill
          className="object-cover"
          data-ai-hint={trip.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <motion.div
          className="absolute bottom-0 left-0 p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-headline text-5xl font-bold text-white">
            {trip.name}
          </h1>
        </motion.div>
      </motion.div>

      {/* INFO */}
      <motion.div
        className="mb-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{trip.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{dateRange}</span>
          </div>
        </div>
      </motion.div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              AI-Powered Itinerary
            </CardTitle>
          </CardHeader>

          <CardContent>
            {trip.itinerary && trip.itinerary.length > 0 ? (
              <div>
                <Accordion type="single" collapsible defaultValue="item-0">
                  {trip.itinerary.map((day: ItineraryDay, index: number) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold font-headline">
                          Day {day.day}: {day.title}
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-4">
                            {day.activities.map(
                              (activity: Activity, activityIndex: number) => (
                                <div
                                  key={activityIndex}
                                  className="pl-4 border-l-2 border-primary/50 space-y-1"
                                >
                                  <div className="font-semibold text-card-foreground">
                                    {activity.description}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      {activity.time}
                                    </span>
                                    <span className="flex items-center gap-2">
                                      <Map className="h-4 w-4" />
                                      {activity.location}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
            ) : (
              <motion.div
                className="text-center py-8 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-muted-foreground mb-4">
                  No itinerary has been generated for this trip yet.
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleGenerateItinerary}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Itinerary
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}