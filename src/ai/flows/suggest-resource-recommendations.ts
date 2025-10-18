'use server';

/**
 * @fileOverview AI-powered resource recommendation flow.
 *
 * This file defines a Genkit flow that provides personalized resource
 * recommendations to students based on their past activity and listed resources.
 *
 * @fileOverview AI-powered resource recommendation flow.
 * - suggestResourceRecommendations - A function that returns personalized resource recommendations.
 * - SuggestResourceRecommendationsInput - The input type for the suggestResourceRecommendations function.
 * - SuggestResourceRecommendationsOutput - The return type for the suggestResourceRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResourceRecommendationsInputSchema = z.object({
  userActivity: z
    .string()
    .describe(
      'A summary of the user past activity, including viewed listings, listed resources, and search history.'
    ),
  availableResources: z
    .string()
    .describe('A description of the currently available resources.'),
});
export type SuggestResourceRecommendationsInput = z.infer<
  typeof SuggestResourceRecommendationsInputSchema
>;

const SuggestResourceRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe(
      'A list of resource recommendations tailored to the user, including title, description, category, department, semester, and price.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why resources are suggested, referencing user activity and available resources.'
    ),
});
export type SuggestResourceRecommendationsOutput = z.infer<
  typeof SuggestResourceRecommendationsOutputSchema
>;

export async function suggestResourceRecommendations(
  input: SuggestResourceRecommendationsInput
): Promise<SuggestResourceRecommendationsOutput> {
  return suggestResourceRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResourceRecommendationsPrompt',
  input: {schema: SuggestResourceRecommendationsInputSchema},
  output: {schema: SuggestResourceRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized resource recommendations to students.

Analyze the user's past activity and the available resources to provide a list of relevant recommendations.

User Activity: {{{userActivity}}}
Available Resources: {{{availableResources}}}

Provide a list of resource recommendations, including title, description, category, department, semester, and price.
Also, provide an explanation of why those resources are suggested, referencing the user activity and available resources.

Format the output as a JSON object with "recommendations" (array of resource descriptions) and "reasoning" (string explanation) fields.
`,
});

const suggestResourceRecommendationsFlow = ai.defineFlow(
  {
    name: 'suggestResourceRecommendationsFlow',
    inputSchema: SuggestResourceRecommendationsInputSchema,
    outputSchema: SuggestResourceRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
