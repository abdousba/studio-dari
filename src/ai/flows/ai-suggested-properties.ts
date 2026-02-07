'use server';
/**
 * @fileOverview Provides AI-powered property suggestions based on user preferences.
 *
 * - suggestProperties - A function that returns suggested properties based on user input.
 * - SuggestedPropertiesInput - The input type for the suggestProperties function.
 * - SuggestedPropertiesOutput - The return type for the suggestProperties function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedPropertiesInputSchema = z.object({
  searchHistory: z
    .string()
    .describe('The user search history, as a string.'),
  savedProperties: z
    .string()
    .describe('The user saved properties, as a string.'),
  userPreferences: z
    .string()
    .describe('The user preferences, as a string'),
});
export type SuggestedPropertiesInput = z.infer<typeof SuggestedPropertiesInputSchema>;

const SuggestedPropertiesOutputSchema = z.object({
  suggestedProperties: z.array(z.string()).describe('An array of suggested properties based on user data.'),
});
export type SuggestedPropertiesOutput = z.infer<typeof SuggestedPropertiesOutputSchema>;

export async function suggestProperties(input: SuggestedPropertiesInput): Promise<SuggestedPropertiesOutput> {
  return suggestPropertiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPropertiesPrompt',
  input: {schema: SuggestedPropertiesInputSchema},
  output: {schema: SuggestedPropertiesOutputSchema},
  prompt: `You are an AI assistant designed to suggest properties to users based on their search history, saved properties and user preferences.

  Search History: {{{searchHistory}}}
  Saved Properties: {{{savedProperties}}}
  User Preferences: {{{userPreferences}}}

  Suggest properties that the user may be interested in. Return the properties as a list.
  `,
});

const suggestPropertiesFlow = ai.defineFlow(
  {
    name: 'suggestPropertiesFlow',
    inputSchema: SuggestedPropertiesInputSchema,
    outputSchema: SuggestedPropertiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
