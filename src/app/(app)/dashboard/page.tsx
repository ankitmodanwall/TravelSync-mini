'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TripList } from '@/components/dashboard/trip-list';
import { Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SuggestionCard } from '@/components/discover/suggestion-card';
import { SuggestionDetailsDialog } from '@/components/discover/suggestion-details-dialog';
import { travelSuggestions } from '@/lib/suggestions';
import type { TravelSuggestion } from '@/lib/suggestions';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<TravelSuggestion | null>(null);

  const handleOpenDialog = (suggestion: TravelSuggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleCloseDialog = () => {
    setSelectedSuggestion(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between slide-in-from-bottom-4 animate-in fade-in duration-700">
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold md:text-4xl text-foreground">
            Your Trips
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Here are all your upcoming and past adventures. Ready for another one?
          </p>
        </div>
        <Button asChild className="hidden md:flex bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300 text-white transition-all duration-300 ease-in-out hover:from-indigo-600 hover:to-cyan-400 hover:shadow-lg hover:scale-105 active:scale-95">
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Link>
        </Button>
      </div>
      
      <TripList />

      <Separator className="my-8 bg-border/50 animate-in fade-in duration-1000" />

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold md:text-4xl flex items-center gap-3">
             <Sparkles className="text-cyan-400 animate-pulse"/>
            Discover New Adventures
          </h2>
          <p className="text-muted-foreground">
            Get inspired for your next trip with our curated destinations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {travelSuggestions.map((suggestion, i) => (
             <div 
               key={suggestion.id} 
               className="animate-in fade-in zoom-in-95 duration-500"
               style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
             >
               <SuggestionCard
                  suggestion={suggestion}
                  onOpen={() => handleOpenDialog(suggestion)}
                />
             </div>
          ))}
        </div>
      </div>

      {selectedSuggestion && (
        <SuggestionDetailsDialog
          suggestion={selectedSuggestion}
          isOpen={!!selectedSuggestion}
          onClose={handleCloseDialog}
        />
      )}
      
      <Button asChild className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white">
        <Link href="/trips/new">
          <Plus className="h-6 w-6"/>
          <span className="sr-only">New Trip</span>
        </Link>
      </Button>
    </div>
  );
}
