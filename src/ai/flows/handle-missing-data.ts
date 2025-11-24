'use server';

/**
 * @fileOverview An AI agent for handling missing data in a dataset.
 *
 * - handleMissingData - A function that takes a dataset as input and returns a dataset with imputed missing values.
 * - HandleMissingDataInput - The input type for the handleMissingData function.
 * - HandleMissingDataOutput - The return type for the handleMissingData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleMissingDataInputSchema = z.object({
  dataset: z.string().describe('The dataset to be cleaned, in CSV or Excel format.'),
});
export type HandleMissingDataInput = z.infer<typeof HandleMissingDataInputSchema>;

const HandleMissingDataOutputSchema = z.object({
  cleanedDataset: z.string().describe('The dataset with missing values imputed.'),
  report: z.string().describe('A report summarizing the missing data imputation process and the techniques used.'),
});
export type HandleMissingDataOutput = z.infer<typeof HandleMissingDataOutputSchema>;

export async function handleMissingData(input: HandleMissingDataInput): Promise<HandleMissingDataOutput> {
  return handleMissingDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleMissingDataPrompt',
  input: {schema: HandleMissingDataInputSchema},
  output: {schema: HandleMissingDataOutputSchema},
  prompt: `You are an expert data scientist specializing in data cleaning and preprocessing.

You will receive a dataset, and your task is to identify and handle any missing values.

Consider the data types of each column and use appropriate imputation techniques such as mean, median, mode, or more advanced methods like regression imputation.

Generate a cleaned dataset with missing values imputed and a report summarizing the imputation process.

Dataset:
{{dataset}}

Output the cleaned dataset and a report.
`,
});

const handleMissingDataFlow = ai.defineFlow(
  {
    name: 'handleMissingDataFlow',
    inputSchema: HandleMissingDataInputSchema,
    outputSchema: HandleMissingDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
