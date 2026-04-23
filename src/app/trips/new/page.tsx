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
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

import { motion } from 'framer-motion';

/* ---------------- Schema ---------------- */

const formSchema = z.object({
  destination: z
    .string()
    .min(2, { message: 'Destination must be at least 2 characters.' }),
  dates: z.object(
    {
      from: z.date(),
      to: z.date(),
    },
    { required_error: 'Please select a date range.' }
  ),
  tripType: z.string(),
  budget: z.preprocess(
    (a) =>
      a === '' || a === undefined
        ? undefined
        : parseFloat(z.string().parse(a)),
    z.number().positive().optional()
  ),
});

/* ---------------- Page ---------------- */

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
      });
      return;
    }

    setIsGenerating(true);

    const duration =
      (values.dates.to.getTime() - values.dates.from.getTime()) /
        (1000 * 3600 * 24) +
      1;

    try {
      const tripsCollection = collection(firestore, 'trips');

      const docRef = await addDoc(tripsCollection, {
        name: `Trip to ${values.destination}`,
        destination: values.destination,
        startDate: Timestamp.fromDate(values.dates.from),
        endDate: Timestamp.fromDate(values.dates.to),
        ownerId: user.uid,
        collaboratorIds: [user.uid],
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
        imageHint: 'travel landscape',
        itinerary: [],
        budget: values.budget || 0,
      });

      toast({
        title: 'Trip Created!',
        description: 'Generating AI itinerary...',
      });

      const aiResponse = await generateItineraryFromPrompt({
        destination: values.destination,
        duration,
        tripType: values.tripType,
        budget: values.budget,
      });

      const itineraryObject = JSON.parse(aiResponse.itinerary);

      await updateDoc(doc(firestore, 'trips', docRef.id), {
        itinerary: itineraryObject.itinerary || [],
      });

      router.push(`/trips/${docRef.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error creating trip',
      });
      setIsGenerating(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="space-y-2 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          Plan a New Trip
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to start your journey.
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-xl border border-white/10 bg-background/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >

                {/* Destination */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris, France" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where are you heading?
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Dates */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Trip Dates</FormLabel>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from
                                ? format(field.value.from, 'PPP')
                                : 'Pick dates'}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="p-0">
                            <Calendar
                              mode="range"
                              selected={field.value as DateRange}
                              onSelect={field.onChange}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Trip Type + Budget */}
                <motion.div
                  className="grid md:grid-cols-2 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FormField
                    control={form.control}
                    name="tripType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Type</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="budget">Budget</SelectItem>
                            <SelectItem value="leisure">Leisure</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                            <SelectItem value="romantic">Romantic</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Trip & AI Plan...
                      </>
                    ) : (
                      'Create Trip'
                    )}
                  </Button>
                </motion.div>

              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}