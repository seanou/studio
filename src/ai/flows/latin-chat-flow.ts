'use server';

import { ai } from '@/ai/genkit';
import { LatinChatInputSchema, LatinChatOutputSchema, type LatinChatInput, type LatinChatOutput } from '@/ai/flows/types';


const latinChatFlow = ai.defineFlow(
  {
    name: 'latinChatFlow',
    inputSchema: LatinChatInputSchema,
    outputSchema: LatinChatOutputSchema,
  },
  async (input) => {
    const prompt = `Tu es un expert en latin. Réponds à la question suivante uniquement en latin. Ne fournis aucune traduction ou explication en français ou dans une autre langue. Ta réponse doit être exclusivement en latin.
    
    Question: ${input.message}`;

    const llmResponse = await ai.generate({
        prompt: prompt,
    });
    
    return { response: llmResponse.text };
  }
);

export async function latinChat(input: LatinChatInput): Promise<LatinChatOutput> {
  return await latinChatFlow(input);
}
