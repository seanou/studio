import { z } from 'zod';

export const LatinChatInputSchema = z.object({
  message: z.string(),
});
export type LatinChatInput = z.infer<typeof LatinChatInputSchema>;

export const LatinChatOutputSchema = z.object({
  response: z.string(),
});
export type LatinChatOutput = z.infer<typeof LatinChatOutputSchema>;
