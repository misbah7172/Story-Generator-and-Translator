
'use server';
/**
 * @fileOverview A story translation AI agent.
 *
 * - translateStory - A function that handles the story translation process.
 * - TranslateStoryInput - The input type for the translateStory function.
 * - TranslateStoryOutput - The return type for the translateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateStoryInputSchema = z.object({
  textToTranslate: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., Spanish, French, German).'),
});
export type TranslateStoryInput = z.infer<typeof TranslateStoryInputSchema>;

const TranslateStoryOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateStoryOutput = z.infer<typeof TranslateStoryOutputSchema>;

export async function translateStory(input: TranslateStoryInput): Promise<TranslateStoryOutput> {
  return translateStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateStoryPrompt',
  input: {schema: TranslateStoryInputSchema},
  output: {schema: TranslateStoryOutputSchema},
  prompt: `Translate the following text to {{{targetLanguage}}}:

{{{textToTranslate}}}

Ensure the translation maintains the original tone and style of the story as much as possible.
Only provide the translated text as output.`,
});

const translateStoryFlow = ai.defineFlow(
  {
    name: 'translateStoryFlow',
    inputSchema: TranslateStoryInputSchema,
    outputSchema: TranslateStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
