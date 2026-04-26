// src/ai/genkit.ts
import 'server-only';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { config } from 'dotenv';
config();

const googleAiPlugin = googleAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY!,   // keep secret on server
});

export const ai = genkit({
  plugins: [googleAiPlugin],
  model: 'googleai/gemini-1.5-flash',
});
