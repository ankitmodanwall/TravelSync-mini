'use client';

import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { Trip, ItineraryDay, Activity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Calendar, MapPin, Sparkles, Clock, Map, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
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

  const { data: trip, isLoading, error } = useDoc<Trip>(tripRef);

  const handleGenerateItinerary = async () => {
    if (!trip || !firestore || !tripRef) return;

    setIsGenerating(true);
    try {
      const duration = (trip.endDate.toDate().getTime() - trip.startDate.toDate().getTime()) / (1000 * 3600 * 24) + 1;
      
      const aiResponse = await generateItineraryFromPrompt({
        destination: trip.destination,
        duration: duration,
        tripType: "leisure", // You might want to store tripType in the trip document
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
      console.error("Error generating itinerary:", error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate an itinerary. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <TripDetailSkeleton />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Trip not found"
        message="We couldn't retrieve the trip details. It might have been deleted or you don't have permission to view it."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!trip) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Trip not found"
        description="The trip you're looking for doesn't exist or has been removed."
        actionLabel="Go to Dashboard"
        actionHref="/dashboard"
      />
    );
  }
  
  const dateRange = trip.startDate && trip.endDate 
    ? `${format(trip.startDate.toDate(), 'MMMM dd, yyyy')} to ${format(trip.endDate.toDate(), 'MMMM dd, yyyy')}`
    : 'Date not set';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative mb-8 h-56 w-full overflow-hidden rounded-2xl sm:h-72 md:h-80">
        <Image
          src={trip.imageUrl}
          alt={trip.name}
          fill
          className="object-cover"
          data-ai-hint={trip.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8">
          <h1 className="font-headline text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {trip.name}
          </h1>
        </div>
      </div>
      
      <div className="mb-8 space-y-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-muted-foreground sm:gap-x-6 sm:text-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 shrink-0" />
            <span>{trip.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 shrink-0" />
            <span>{dateRange}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI-Powered Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trip.itinerary && trip.itinerary.length > 0 ? (
            <Accordion type="single" collapsible defaultValue="item-0">
              {trip.itinerary.map((day: ItineraryDay, index: number) => (
                <AccordionItem value={`item-${index}`} key={day.day}>
                  <AccordionTrigger className="text-lg font-semibold font-headline">
                    Day {day.day}: {day.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {day.activities.map((activity: Activity, activityIndex: number) => (
                        <div key={activityIndex} className="pl-4 border-l-2 border-primary/50 space-y-1">
                          <div className="font-semibold text-card-foreground">{activity.description}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {activity.time}</span>
                            <span className="flex items-center gap-2"><Map className="h-4 w-4" /> {activity.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
              <div className="text-center py-8 px-4">
                <p className="text-muted-foreground mb-4">
                  No itinerary has been generated for this trip yet.
                </p>
                <Button onClick={handleGenerateItinerary} disabled={isGenerating}>
                  {isGenerating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generate Itinerary</>
                  )}
                </Button>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
