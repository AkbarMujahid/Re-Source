'use server';

/**
 * @fileOverview Generates a moderation report from user-submitted content flags.
 *
 * - generateModerationReport - A function that generates a moderation report.
 * - GenerateModerationReportInput - The input type for the generateModerationReport function.
 * - GenerateModerationReportOutput - The return type for the generateModerationReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateModerationReportInputSchema = z.object({
  reports: z.array(
    z.object({
      reporterId: z.string().describe('The ID of the user who reported the content.'),
      reportedContentId: z.string().describe('The ID of the reported content.'),
      contentType: z.enum(['listing', 'user']).describe('The type of the reported content.'),
      reason: z.string().describe('The reason for the report.'),
    })
  ).describe('An array of reports to summarize.'),
});

export type GenerateModerationReportInput = z.infer<typeof GenerateModerationReportInputSchema>;

const GenerateModerationReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the reports, highlighting potential issues and recommended actions.'),
});

export type GenerateModerationReportOutput = z.infer<typeof GenerateModerationReportOutputSchema>;

export async function generateModerationReport(input: GenerateModerationReportInput): Promise<GenerateModerationReportOutput> {
  return generateModerationReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateModerationReportPrompt',
  input: {schema: GenerateModerationReportInputSchema},
  output: {schema: GenerateModerationReportOutputSchema},
  prompt: `You are an AI assistant specializing in content moderation.  Your task is to summarize a list of user reports and identify potential issues, as well as recommend actions to be taken by the administrator.  Be concise and objective.

Reports:
{{#each reports}}
- Reporter ID: {{this.reporterId}}
  Reported Content ID: {{this.reportedContentId}}
  Content Type: {{this.contentType}}
  Reason: {{this.reason}}
{{/each}}
`,
});

const generateModerationReportFlow = ai.defineFlow(
  {
    name: 'generateModerationReportFlow',
    inputSchema: GenerateModerationReportInputSchema,
    outputSchema: GenerateModerationReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
