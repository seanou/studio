'use server';

import { ai } from '@/ai/genkit';
import {
  LanguageChatInputSchema,
  LanguageChatOutputSchema,
  type LanguageChatInput,
  type LanguageChatOutput,
} from '@/ai/flows/types';

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
        
        Important : Pour les mots qui pourraient être difficiles pour un débutant, tu dois les envelopper dans des doubles crochets avec leur traduction en français, comme ceci : [[mot:traduction]]. Par exemple, si le mot est "dominus", tu écriras [[dominus:maître]]. Fais-le pour 3 à 5 mots par réponse.
    
        Question: ${input.message}`,
        model: 'googleai/gemini-2.5-flash',
    });
    
    return { response: llmResponse.text };
  }
);

export async function languageChat(input: LanguageChatInput): Promise<LanguageChatOutput> {
  return await languageChatFlow(input);
}
