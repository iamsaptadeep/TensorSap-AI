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
  dataset: z.string().describe('A sample of the dataset to be cleaned, in CSV or similar text-based format.'),
});
export type HandleMissingDataInput = z.infer<typeof HandleMissingDataInputSchema>;

const HandleMissingDataOutputSchema = z.object({
  cleanedDataset: z.string().describe('A summary of what a cleaned dataset with imputed values would look like.'),
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

You will receive a sample of a dataset. Your task is to identify columns with missing values and suggest appropriate imputation techniques for each.

Consider the data types of each column (numerical, categorical) and use that to inform your choice of imputation (e.g., mean, median, mode for numerical; mode or a new category for categorical).

Based on your analysis, generate:
1.  A report summarizing the columns with missing data and the imputation techniques you suggest for each.
2.  A brief, textual description of what the dataset would look like after these cleaning steps are applied. Do not actually produce a full cleaned dataset.

Dataset Sample:
{{{dataset}}}
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
