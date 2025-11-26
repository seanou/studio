
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
    
    let difficulty;
    if (input.skillLevel <= 25) {
        difficulty = 'avancé (B2/C1), n\'hésite pas à utiliser des structures de phrases complexes et un vocabulaire riche. Propose la traduction de 2 mots.';
    } else if (input.skillLevel <= 50) {
        difficulty = 'intermédiaire (B1), avec une grammaire un peu plus complexe. Propose la traduction de 3 mots.';
    } else if (input.skillLevel <= 75) {
        difficulty = 'débutant (A2), avec des phrases simples. Propose la traduction de 4 mots.';
    } else {
        difficulty = 'très débutant (A1), utilise des phrases très simples et un vocabulaire de base. Propose la traduction de 5 mots.';
    }

    const llmResponse = await ai.generate({
        prompt: `Tu es un expert en ${languageName}. Ton niveau de langue doit correspondre à celui d'un locuteur ${difficulty}. Réponds à la question suivante de l'utilisateur. Ta réponse doit être exclusivement en ${languageName}. Ne fournis aucune traduction ou explication dans une autre langue.
        
        Important : Pour les mots qui pourraient être difficiles pour un débutant, tu dois les envelopper dans des doubles crochets avec leur traduction en français, comme ceci : [[mot:traduction]]. Par exemple, si le mot est "dominus", tu écriras [[dominus:maître]]. Le nombre de mots à traduire dépend du niveau de difficulté défini.
    
        Question: ${input.message}`,
        model: 'googleai/gemini-2.5-flash',
    });
    
    return { response: llmResponse.text };
  }
);

export async function languageChat(input: LanguageChatInput): Promise<LanguageChatOutput> {
  return await languageChatFlow(input);
}
