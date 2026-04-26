import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { TravelSuggestion } from '@/lib/suggestions';
import { Badge } from '../ui/badge';

interface SuggestionCardProps {
  suggestion: TravelSuggestion;
  onOpen: () => void;
}

export function SuggestionCard({ suggestion, onOpen }: SuggestionCardProps) {
  return (
    <Card
      className="group block cursor-pointer overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl bg-card backdrop-blur-sm"
      onClick={onOpen}
    >
      <div className="relative h-64 w-full">
        <Image
          src={suggestion.imageUrl}
          alt={suggestion.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          data-ai-hint={suggestion.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="font-headline text-2xl font-bold text-white">
            {suggestion.title}
          </h3>
          <p className="text-sm text-white/90">{suggestion.country}</p>
        </div>
        {suggestion.aiRecommended && (
           <Badge variant="secondary" className="absolute top-3 right-3 bg-sky-400/20 text-sky-300 border-sky-400/30">AI Recommended</Badge>
        )}
      </div>
    </Card>
  );
}
