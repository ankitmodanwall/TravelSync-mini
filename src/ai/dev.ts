import { config } from 'dotenv';
config();

import '@/ai/flows/generate-itinerary-from-prompt.ts';
import '@/ai/flows/summarize-chat-to-short-plan.ts';
import '@/ai/flows/travel-chat.ts';