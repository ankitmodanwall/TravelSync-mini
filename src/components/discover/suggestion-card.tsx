import Image from 'next/image';
import { Card, Badge, Typography } from '@/components/ui';
import type { TravelSuggestion } from '@/lib/suggestions';

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
          <Typography variant="h3" className="text-white font-bold mb-0">
            {suggestion.title}
          </Typography>
          <Typography variant="small" className="text-white/90">
            {suggestion.country}
          </Typography>
        </div>
        {suggestion.aiRecommended && (
           <Badge variant="glass" className="absolute top-3 right-3">AI Recommended</Badge>
        )}
      </div>
    </Card>
  );
}
