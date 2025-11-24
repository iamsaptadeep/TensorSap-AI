'use server';

/**
 * @fileOverview A flow that generates an EDA (Exploratory Data Analysis) report from a dataset.
 *
 * - generateEdaReport - A function that handles the generation of the EDA report.
 * - GenerateEdaReportInput - The input type for the generateEdaReport function.
 * - GenerateEdaReportOutput - The return type for the generateEdaReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEdaReportInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('A description of the dataset including the column names and datatypes.'),
  datasetSample: z
    .string()
    .describe('A sample of the dataset in CSV format (only a few rows).'),
});
export type GenerateEdaReportInput = z.infer<typeof GenerateEdaReportInputSchema>;

const GenerateEdaReportOutputSchema = z.object({
  edaReport: z.string().describe('A human-readable, short, and concise EDA report summarizing key statistics, distributions, and correlations in the dataset.'),
});
export type GenerateEdaReportOutput = z.infer<typeof GenerateEdaReportOutputSchema>;

export async function generateEdaReport(input: GenerateEdaReportInput): Promise<GenerateEdaReportOutput> {
  return generateEdaReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEdaReportPrompt',
  input: {schema: GenerateEdaReportInputSchema},
  output: {schema: GenerateEdaReportOutputSchema},
  prompt: `You are an expert data analyst. Your task is to generate a short and concise EDA (Exploratory Data Analysis) report based on the provided dataset description and sample.

Dataset Description:
{{datasetDescription}}

Dataset Sample:
{{datasetSample}}

Generate a brief report focusing on the most critical findings:
- Key summary statistics for numerical columns.
- A summary of missing values.
- The most significant correlations found.
- One or two key observations.

Keep the report easy to scan and to the point.
`,
});

const generateEdaReportFlow = ai.defineFlow(
  {
    name: 'generateEdaReportFlow',
    inputSchema: GenerateEdaReportInputSchema,
    outputSchema: GenerateEdaReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
