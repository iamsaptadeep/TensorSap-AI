'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests potential analysis types based on a given dataset.
 *
 * The flow takes a dataset description as input and returns suggestions for analysis types like regression, classification, and clustering.
 * It exports:
 *   - suggestAnalysisTypes: A function that triggers the analysis suggestion flow.
 *   - SuggestAnalysisTypesInput: The input type for the suggestAnalysisTypes function.
 *   - SuggestAnalysisTypesOutput: The output type for the suggestAnalysisTypes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAnalysisTypesInputSchema = z.object({
  datasetDescription: z.string().describe('A detailed description of the dataset, including its columns, data types, and potential relationships.'),
});
export type SuggestAnalysisTypesInput = z.infer<typeof SuggestAnalysisTypesInputSchema>;

const SuggestAnalysisTypesOutputSchema = z.object({
  suggestedAnalysisTypes: z.array(z.string()).describe('An array of suggested analysis types (e.g., regression, classification, clustering) that are potentially suitable for the dataset.'),
  reasoning: z.string().describe('The reasoning behind the suggested analysis types, explaining why each type is appropriate for the dataset.'),
});
export type SuggestAnalysisTypesOutput = z.infer<typeof SuggestAnalysisTypesOutputSchema>;

export async function suggestAnalysisTypes(input: SuggestAnalysisTypesInput): Promise<SuggestAnalysisTypesOutput> {
  return suggestAnalysisTypesFlow(input);
}

const suggestAnalysisTypesPrompt = ai.definePrompt({
  name: 'suggestAnalysisTypesPrompt',
  input: {schema: SuggestAnalysisTypesInputSchema},
  output: {schema: SuggestAnalysisTypesOutputSchema},
  prompt: `You are an expert data analyst. Given the following description of a dataset, suggest potential analysis types (regression, classification, clustering, etc.) that could be applied to it.  Also provide a brief explanation for why each analysis type might be suitable.

Dataset Description: {{{datasetDescription}}}

Consider the data types of the columns, potential relationships between variables, and the overall goals of data analysis.

Format your output as a JSON object with 'suggestedAnalysisTypes' (an array of strings) and 'reasoning' (a string).
`, 
});

const suggestAnalysisTypesFlow = ai.defineFlow(
  {
    name: 'suggestAnalysisTypesFlow',
    inputSchema: SuggestAnalysisTypesInputSchema,
    outputSchema: SuggestAnalysisTypesOutputSchema,
  },
  async input => {
    const {output} = await suggestAnalysisTypesPrompt(input);
    return output!;
  }
);
