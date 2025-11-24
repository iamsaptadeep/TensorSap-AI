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
  edaReport: z.string().describe('A human-readable EDA report summarizing key statistics, distributions, and correlations in the dataset.'),
});
export type GenerateEdaReportOutput = z.infer<typeof GenerateEdaReportOutputSchema>;

export async function generateEdaReport(input: GenerateEdaReportInput): Promise<GenerateEdaReportOutput> {
  return generateEdaReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEdaReportPrompt',
  input: {schema: GenerateEdaReportInputSchema},
  output: {schema: GenerateEdaReportOutputSchema},
  prompt: `You are an expert data analyst. Your task is to generate an EDA (Exploratory Data Analysis) report based on the provided dataset description and sample.

Dataset Description:
{{datasetDescription}}

Dataset Sample:
{{datasetSample}}

Generate a comprehensive EDA report that includes:
- Summary statistics for numerical columns (mean, median, standard deviation, min, max, quartiles).
- Distributions of numerical columns (histograms or density plots).
- Frequency tables for categorical columns.
- Correlations between numerical columns (correlation matrix).
- Identification of missing values and outliers.
- Potential insights and observations about the data.

Ensure the report is human-readable and easy to understand for someone with a basic understanding of data analysis.
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
