// src/ai/flows/search-genially-history.ts
'use server';

/**
 * @fileOverview Implements a Genkit flow for searching through the history of Genially presentations.
 *
 * - searchGeniallyHistory - A function that searches Genially history using keywords and semantic search.
 * - SearchGeniallyHistoryInput - The input type for the searchGeniallyHistory function.
 * - SearchGeniallyHistoryOutput - The return type for the searchGeniallyHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchGeniallyHistoryInputSchema = z.object({
  keywords: z.string().describe('Keywords to search for in Genially history.'),
  geniallyTitles: z.array(z.string()).describe('A list of available genially titles to search through')
});
export type SearchGeniallyHistoryInput = z.infer<typeof SearchGeniallyHistoryInputSchema>;

const SearchGeniallyHistoryOutputSchema = z.object({
  searchResults: z.array(z.string()).describe('A list of Genially titles that match the search criteria.'),
});
export type SearchGeniallyHistoryOutput = z.infer<typeof SearchGeniallyHistoryOutputSchema>;

export async function searchGeniallyHistory(input: SearchGeniallyHistoryInput): Promise<SearchGeniallyHistoryOutput> {
  return searchGeniallyHistoryFlow(input);
}

const searchGeniallyHistoryPrompt = ai.definePrompt({
  name: 'searchGeniallyHistoryPrompt',
  input: {schema: SearchGeniallyHistoryInputSchema},
  output: {schema: SearchGeniallyHistoryOutputSchema},
  prompt: `You are an AI assistant designed to search through a list of Genially presentation titles and return the ones that best match the user's search query.

  The available genially titles are:
  {{#each geniallyTitles}}
  - {{{this}}}
  {{/each}}

  User's search query: {{{keywords}}}

  Based on the search query, return a list of Genially presentation titles that are most relevant to the query. Be as comprehensive as possible.
  `, 
});

const searchGeniallyHistoryFlow = ai.defineFlow(
  {
    name: 'searchGeniallyHistoryFlow',
    inputSchema: SearchGeniallyHistoryInputSchema,
    outputSchema: SearchGeniallyHistoryOutputSchema,
  },
  async input => {
    const {output} = await searchGeniallyHistoryPrompt(input);
    return output!;
  }
);
