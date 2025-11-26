import { z } from 'zod';

export const LanguageChatInputSchema = z.object({
  message: z.string(),
  language: z.enum(['latin', 'grec']),
});
export type LanguageChatInput = z.infer<typeof LanguageChatInputSchema>;

export const LanguageChatOutputSchema = z.object({
  response: z.string(),
});
export type LanguageChatOutput = z.infer<typeof LanguageChatOutputSchema>;
