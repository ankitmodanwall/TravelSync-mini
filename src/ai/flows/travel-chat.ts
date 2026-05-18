'use server';
/**
 * @fileOverview Chat assistant for TravelSync.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { errorToMeta, logger } from '@/lib/logger';

const TravelChatInputSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
});
export type TravelChatInput = z.infer<typeof TravelChatInputSchema>;

const TravelChatOutputSchema = z.object({
  response: z.string(),
});
export type TravelChatOutput = z.infer<typeof TravelChatOutputSchema>;

export async function travelChat(
  input: TravelChatInput
): Promise<TravelChatOutput> {
  return travelChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'travelChatPrompt',
  input: { schema: TravelChatInputSchema },
  output: { schema: TravelChatOutputSchema },
  prompt: `You are TravelSync, a friendly travel planning assistant for a web app.
Be concise and helpful. Ask a clarifying question if needed.
If users ask about the app, describe features like trips, itineraries, budgets, and collaboration.

Conversation so far:
{{#each history}}
{{role}}: {{content}}
{{/each}}

User: {{message}}
Assistant:`,
});

const travelChatFlow = ai.defineFlow(
  {
    name: 'travelChatFlow',
    inputSchema: TravelChatInputSchema,
    outputSchema: TravelChatOutputSchema,
  },
  async input => {
    const history = input.history ?? [];

    logger.info('travelChatFlow started.', {
      messageLength: input.message.length,
      historyCount: history.length,
    });

    try {
      const { output } = await prompt({
        ...input,
        history,
      });

      logger.info('travelChatFlow completed.', {
        historyCount: history.length,
      });

      return output!;
    } catch (error) {
      logger.error('travelChatFlow failed.', {
        ...errorToMeta(error),
      });
      throw error;
    }
  }
);
