'use server';

import { ai } from '@/ai/genkit';
import {
  LanguageChatInputSchema,
  LanguageChatOutputSchema,
  type LanguageChatInput,
  type LanguageChatOutput,
} from '@/ai/flows/types';
import { z } from 'zod';

const getDefinition = ai.defineTool(
    {
      name: 'getDefinition',
      description: 'Obtiens la définition d\'un mot en français. Utilise cet outil si l\'utilisateur demande la définition d\'un mot.',
      inputSchema: z.object({
        word: z.string().describe('Le mot à définir.'),
        language: z.enum(['latin', 'grec ancien']).describe('La langue du mot (latin ou grec ancien).'),
      }),
      outputSchema: z.string().describe('La définition du mot.'),
    },
    async ({ word, language }) => {
      // Pour une vraie application, vous appelleriez ici une API de dictionnaire.
      // Pour l'instant, nous retournons une définition factice.
      return `Définition pour le mot ${language} "${word}" : [définition placeholder].`;
    }
  );


const languageChatFlow = ai.defineFlow(
  {
    name: 'languageChatFlow',
    inputSchema: LanguageChatInputSchema,
    outputSchema: LanguageChatOutputSchema,
    tools: [getDefinition],
  },
  async (input) => {
    const languageName = input.language === 'latin' ? 'latin' : 'grec ancien';
    
    const llmResponse = await ai.generate({
        prompt: `Tu es un expert en ${languageName}. Réponds à la question suivante uniquement en ${languageName}. Ne fournis aucune traduction ou explication dans une autre langue, sauf si on te demande une définition. Ta réponse doit être exclusivement en ${languageName}.
    
        Question: ${input.message}`,
        tools: [getDefinition],
        model: 'googleai/gemini-2.5-flash',
    });
    
    const toolCalls = llmResponse.toolCalls();
    if (toolCalls.length > 0) {
        const toolResponses = [];
        for (const toolCall of toolCalls) {
            const toolResponse = await toolCall.run();
            toolResponses.push(toolResponse);
        }
        
        const finalResponse = await ai.generate({
            prompt: `Tu es un expert en ${languageName}. L'utilisateur a demandé une définition. Réponds en français en te basant sur la définition fournie.`,
            history: [
                { role: 'user', content: [{text: input.message}] },
                llmResponse.message,
                { role: 'tool', content: toolResponses.map((output, i) => ({
                    toolResponse: {
                        name: toolCalls[i].name,
                        output: output
                    }
                }))}
            ],
            model: 'googleai/gemini-2.5-flash',
            tools: [getDefinition]
        });
        return { response: finalResponse.text };
    }

    return { response: llmResponse.text };
  }
);

export async function languageChat(input: LanguageChatInput): Promise<LanguageChatOutput> {
  return await languageChatFlow(input);
}
