'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { generateItineraryFromPrompt } from '@/ai/flows/generate-itinerary-from-prompt';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { useFirestore } from '@/firebase';
import { addDoc, collection, doc, updateDoc, Timestamp } from 'firebase/firestore';

const formSchema = z.object({
  destination: z
    .string()
    .min(2, { message: 'Destination must be at least 2 characters.' }),
  dates: z.object(
    {
      from: z.date({ required_error: 'A start date is required.' }),
      to: z.date({ required_error: 'An end date is required.' }),
    },
    { required_error: 'Please select a date range.' }
  ),
  tripType: z.string({ required_error: 'Please select a trip type.' }),
  budget: z.preprocess(
    (a) => (a === '' || a === undefined ? undefined : parseFloat(z.string().parse(a))),
    z.number().positive({ message: 'Budget must be a positive number.' }).optional()
  ),
});

export default function NewTripPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const firestore = useFirestore();
  
  const destinationParam = searchParams.get('destination');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: destinationParam || '',
      budget: undefined,
    },
  });

  useEffect(() => {
    if (destinationParam) {
      form.setValue('destination', destinationParam);
    }
  }, [destinationParam, form]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create a trip.',
      });
      return;
    }

    setIsGenerating(true);
    const duration =
      (values.dates.to.getTime() - values.dates.from.getTime()) /
        (1000 * 3600 * 24) +
      1;

    try {
      // First, create the trip document to get an ID
      const tripsCollection = collection(firestore, 'trips');
      const newTripData = {
        name: `Trip to ${values.destination}`,
        destination: values.destination,
        startDate: Timestamp.fromDate(values.dates.from),
        endDate: Timestamp.fromDate(values.dates.to),
        ownerId: user.uid,
        collaboratorIds: [user.uid],
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
        imageHint: 'travel landscape',
        itinerary: [], // Start with an empty itinerary
        budget: values.budget || 0,
      };

      const docRef = await addDoc(tripsCollection, newTripData);

      toast({
        title: 'Trip Created!',
        description: 'Now generating your AI-powered itinerary...',
      });

      // Now, generate the itinerary
      try {
        const aiResponse = await generateItineraryFromPrompt({
          destination: values.destination,
          duration,
          tripType: values.tripType,
          budget: values.budget,
        });

        // Parse and update the document
        const itineraryObject = JSON.parse(aiResponse.itinerary);
        const tripDocRef = doc(firestore, 'trips', docRef.id);
        await updateDoc(tripDocRef, {
          itinerary: itineraryObject.itinerary || [],
        });

        toast({
          title: 'Itinerary Generated!',
          description: 'Your new adventure has been planned.',
        });
      } catch (aiError) {
        console.error("Error generating or saving itinerary:", aiError);
        toast({
          variant: 'destructive',
          title: 'AI Itinerary Failed',
          description: 'Could not generate an itinerary, but your trip was saved. You can try generating it again from the trip page.',
        });
      }

      router.push(`/trips/${docRef.id}`);

    } catch (error) {
      console.error('Failed to create trip', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem creating your trip.',
      });
      setIsGenerating(false);
    } 
  };

  return (
    <div className="h-full overflow-y-auto pb-8">
  <div className="max-w-4xl mx-auto px-4">
       <div className="space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-headline font-bold">
            Plan a New Trip
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to start your next journey.
          </p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paris, France" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where are you heading to?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Trip Dates</FormLabel>
                    <Popover modal={false}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, 'LLL dd, y')} -{' '}
                                  {format(field.value.to, 'LLL dd, y')}
                                </>
                              ) : (
                                format(field.value.from, 'LLL dd, y')
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                     <PopoverContent
  className="w-auto max-w-[calc(100vw-2rem)] overflow-x-auto p-0"
  align="start"
  sideOffset={8}
>
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value as DateRange}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the start and end dates for your trip.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="tripType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Trip</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a trip style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="budget">Budget</SelectItem>
                          <SelectItem value="leisure">Leisure</SelectItem>
                          <SelectItem value="family">Family-Friendly</SelectItem>
                          <SelectItem value="romantic">Romantic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This helps us tailor suggestions for you.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2000" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormDescription>
                        Set an optional budget for this trip.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Trip & Itinerary...
                  </>
                ) : (
                  'Create Trip & Generate Itinerary'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>  
  </div>
  );
}
