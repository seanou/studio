'use server';

import { ai } from '@/ai/genkit';
import {
  LanguageChatInputSchema,
  LanguageChatOutputSchema,
  type LanguageChatInput,
  type LanguageChatOutput,
} from '@/ai/flows/types';
import { z } from 'zod';

const languageChatFlow = ai.defineFlow(
  {
    name: 'languageChatFlow',
    inputSchema: LanguageChatInputSchema,
    outputSchema: LanguageChatOutputSchema,
  },
  async (input) => {
    const languageName = input.language === 'latin' ? 'latin' : 'grec ancien';
    
    const llmResponse = await ai.generate({
        prompt: `Tu es un expert en ${languageName}. Réponds à la question suivante de l'utilisateur. Ta réponse doit être exclusivement en ${languageName}. Ne fournis aucune traduction ou explication dans une autre langue.
    
        Question: ${input.message}`,
        model: 'googleai/gemini-2.5-flash',
    });
    
    return { response: llmResponse.text };
  }
);

export async function languageChat(input: LanguageChatInput): Promise<LanguageChatOutput> {
  return await languageChatFlow(input);
}
