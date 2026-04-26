'use client';

import Link from 'next/link';
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
import { CalendarIcon, Loader2, Sparkles, MapPin, Users, Wallet, CheckCircle2, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { generateItineraryFromPrompt } from '@/ai/flows/generate-itinerary-from-prompt';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { useFirestore } from '@/firebase';
import { addDoc, collection, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Trip name must be at least 2 characters.' }),
  destination: z.string().min(2, { message: 'Destination must be at least 2 characters.' }),
  dates: z.object(
    {
      from: z.date({ required_error: 'A start date is required.' }),
      to: z.date({ required_error: 'An end date is required.' }),
    },
    { required_error: 'Please select a date range.' }
  ),
  tripType: z.string({ required_error: 'Please select a trip style.' }),
  travelerCount: z.string().default('1'),
  budget: z.string({ required_error: 'Please select a budget tier.' }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewTripPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const firestore = useFirestore();
  
  const destinationParam = searchParams.get('destination');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      destination: destinationParam || '',
      tripType: 'leisure',
      travelerCount: '1',
      budget: 'standard',
      notes: '',
    },
  });

  useEffect(() => {
    if (destinationParam) {
      form.setValue('destination', destinationParam);
      form.setValue('name', `Adventure in ${destinationParam}`);
    }
  }, [destinationParam, form]);

  const onSubmit = async (values: FormValues) => {
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
      const tripsCollection = collection(firestore, 'trips');
      const newTripData = {
        name: values.name,
        destination: values.destination,
        startDate: Timestamp.fromDate(values.dates.from),
        endDate: Timestamp.fromDate(values.dates.to),
        ownerId: user.uid,
        collaboratorIds: [user.uid],
        imageUrl: `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80`, // Default high-quality travel image
        imageHint: values.destination,
        itinerary: [],
        budget: values.budget === 'premium' ? 5000 : values.budget === 'standard' ? 2000 : 800,
        tripType: values.tripType,
        travelerCount: parseInt(values.travelerCount),
        notes: values.notes || '',
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(tripsCollection, newTripData);

      toast({
        title: 'Creating your adventure...',
        description: 'Our AI is crafting a personalized itinerary just for you.',
      });

      try {
        const aiResponse = await generateItineraryFromPrompt({
          destination: values.destination,
          duration,
          tripType: values.tripType,
          budget: values.budget === 'premium' ? 5000 : values.budget === 'standard' ? 2000 : 800,
        });

        const itineraryObject = JSON.parse(aiResponse.itinerary);
        const tripDocRef = doc(firestore, 'trips', docRef.id);
        await updateDoc(tripDocRef, {
          itinerary: itineraryObject.itinerary || [],
        });

        toast({
          title: 'Journey Ready!',
          description: `Successfully planned your trip to ${values.destination}.`,
        });
      } catch (aiError) {
        console.error("AI Generation Error:", aiError);
        toast({
          variant: 'destructive',
          title: 'AI Assistant Busy',
          description: 'Trip saved, but itinerary generation failed. You can retry from the trip page.',
        });
      }

      router.push(`/trips/${docRef.id}`);

    } catch (error) {
      console.error('Failed to create trip:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: 'Something went wrong while saving your trip. Please try again.',
      });
      setIsGenerating(false);
    } 
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ['name', 'destination', 'dates'];
    if (step === 2) fieldsToValidate = ['tripType', 'travelerCount'];
    if (step === 3) fieldsToValidate = ['budget'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    { id: 1, label: 'Details', icon: MapPin },
    { id: 2, label: 'Preferences', icon: Users },
    { id: 3, label: 'Budget', icon: Wallet },
    { id: 4, label: 'Summary', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Main Form Area */}
      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl md:text-5xl font-serif font-bold bg-gradient-to-r from-[#c4c0ff] to-[#6c63ff] bg-clip-text text-transparent">
            Plan your next escape
          </h1>
          <p className="text-muted-foreground text-lg">
            Follow the steps below to craft your perfect itinerary.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="relative flex justify-between items-center max-w-2xl mx-auto mb-12">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = step >= s.id;
            const isCurrent = step === s.id;
            
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  isActive ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(108,99,255,0.4)]" : "bg-background border-secondary text-muted-foreground",
                  isCurrent && "scale-110 ring-4 ring-primary/20"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Wizard Card */}
        <Card className="border-border/50 bg-secondary/30 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6 md:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Step 1: Details */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">Trip Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Summer in Santorini" 
                                className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">Destination</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="Santorini, Greece" 
                                  className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="dates"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-foreground/80">When are you going?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full h-12 justify-start text-left font-normal bg-background/50 border-border/50 hover:bg-background/80 transition-all",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                                  {field.value?.from ? (
                                    field.value.to ? (
                                      <span className="font-medium">
                                        {format(field.value.from, 'PPP')} - {format(field.value.to, 'PPP')}
                                      </span>
                                    ) : (
                                      format(field.value.from, 'PPP')
                                    )
                                  ) : (
                                    <span>Select your travel window</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-border/50 shadow-2xl" align="start">
                              <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={field.value?.from}
                                selected={field.value as DateRange}
                                onSelect={field.onChange}
                                numberOfMonths={2}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                className="bg-background rounded-md"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Preferences */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="tripType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">Trip Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-background/50 border-border/50">
                                  <SelectValue placeholder="What's the vibe?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="adventure">🏔️ Adventure & Exploration</SelectItem>
                                <SelectItem value="leisure">🏖️ Relaxation & Leisure</SelectItem>
                                <SelectItem value="culture">🏛️ Culture & History</SelectItem>
                                <SelectItem value="family">👨‍👩‍👧‍👦 Family Friendly</SelectItem>
                                <SelectItem value="romantic">🥂 Romantic Getaway</SelectItem>
                                <SelectItem value="foodie">🍳 Gastronomy & Food</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="travelerCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">Number of Travelers</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-background/50 border-border/50">
                                  <SelectValue placeholder="How many people?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Solo Explorer</SelectItem>
                                <SelectItem value="2">Duo / Couple</SelectItem>
                                <SelectItem value="4">Small Group (3-5)</SelectItem>
                                <SelectItem value="8">Large Group (6+)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">Any special requests? (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g., Vegan food options, low-walking routes, or must-see landmarks..." 
                              className="min-h-[120px] bg-background/50 border-border/50 resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Budget */}
                {step === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-xl font-semibold">Select your budget level</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { id: 'value', label: 'Value', price: '$', desc: 'Hostels, street food, and local transport.', color: 'bg-green-500/10 text-green-500' },
                                { id: 'standard', label: 'Standard', price: '$$', desc: 'Boutique hotels, mid-range dining.', color: 'bg-blue-500/10 text-blue-500' },
                                { id: 'premium', label: 'Premium', price: '$$$', desc: 'Luxury stays, fine dining, private tours.', color: 'bg-purple-500/10 text-purple-500' },
                              ].map((tier) => (
                                <div 
                                  key={tier.id}
                                  onClick={() => field.onChange(tier.id)}
                                  className={cn(
                                    "cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 flex flex-col gap-3 group",
                                    field.value === tier.id 
                                      ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                                      : "border-border/50 bg-background/40 hover:border-border hover:bg-background/60"
                                  )}
                                >
                                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg", tier.color)}>
                                    {tier.price}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-lg">{tier.label}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{tier.desc}</p>
                                  </div>
                                  <div className={cn(
                                    "mt-auto pt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-opacity",
                                    field.value === tier.id ? "opacity-100 text-primary" : "opacity-0"
                                  )}>
                                    <CheckCircle2 className="w-4 h-4" /> Selected
                                  </div>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Summary */}
                {step === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                        <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{form.getValues('name')}</h3>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {form.getValues('destination')}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Dates</p>
                          <p className="font-medium text-sm">
                            {format(form.getValues('dates.from'), 'MMM d')} - {format(form.getValues('dates.to'), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Style</p>
                          <p className="font-medium text-sm capitalize">{form.getValues('tripType')}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Travelers</p>
                          <p className="font-medium text-sm">{form.getValues('travelerCount')} Persons</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Budget</p>
                          <p className="font-medium text-sm capitalize">{form.getValues('budget')}</p>
                        </div>
                      </div>

                      {form.getValues('notes') && (
                        <div className="bg-background/40 p-4 rounded-xl border border-border/50">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Additional Notes</p>
                          <p className="text-sm italic">"{form.getValues('notes')}"</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-secondary/20 p-6 rounded-2xl flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm">Ready to Generate</h4>
                        <p className="text-sm text-muted-foreground">
                          Our AI will take these details and create a day-by-day itinerary with activities, dining suggestions, and travel tips.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={step === 1 || isGenerating}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                  
                  {step < 4 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep} 
                      className="min-w-[140px] gap-2 shadow-lg shadow-primary/20 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isGenerating}
                      className="min-w-[200px] gap-2 bg-gradient-to-r from-primary to-[#6c63ff] hover:opacity-90 shadow-xl shadow-primary/20 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Plan My Trip
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar / AI Insights */}
      <aside className="w-full lg:w-80 space-y-6">
        <div className="sticky top-24 space-y-6">
          {/* Destination Preview Card */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl group">
             <img 
              src={`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80`} 
              alt="Travel background"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-white font-bold text-xl drop-shadow-md">
                {form.watch('destination') || 'Choose a destination'}
              </h4>
              <p className="text-white/80 text-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI-optimized route
              </p>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="bg-secondary/40 backdrop-blur-md rounded-3xl p-6 border border-border/50 space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">AI Insights</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  Did you know?
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Traveling to {form.watch('destination') || 'new places'} during this season often means {step === 3 ? 'better value for luxury stays.' : 'beautiful weather and peak festivals.'}
                </p>
              </div>

              <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Plan Readiness</span>
                  <span className="text-[10px] font-bold text-primary">{Math.round((step / 4) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-out" 
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  { text: 'Optimized flight routes', active: step >= 1 },
                  { text: 'Curated dining list', active: step >= 2 },
                  { text: 'Budget-smart activities', active: step >= 3 },
                ].map((item, i) => (
                  <li key={i} className={cn(
                    "flex items-center gap-2 text-xs transition-opacity duration-300",
                    item.active ? "opacity-100" : "opacity-40"
                  )}>
                    <CheckCircle2 className={cn("w-3.5 h-3.5", item.active ? "text-primary" : "text-muted-foreground")} />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
