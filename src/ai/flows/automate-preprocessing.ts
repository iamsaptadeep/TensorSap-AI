// src/ai/flows/automate-preprocessing.ts
'use server';
/**
 * @fileOverview A flow that automates data preprocessing steps based on the selected analysis type.
 *
 * - automatePreprocessing - A function that automates preprocessing steps.
 * - AutomatePreprocessingInput - The input type for the automatePreprocessing function.
 * - AutomatePreprocessingOutput - The return type for the automatePreprocessing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatePreprocessingInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('A detailed description of the dataset including column names, types, and potential issues.'),
  analysisType: z
    .string()
    .describe(
      'The type of analysis to be performed on the dataset (e.g., regression, classification, clustering).'
    ),
});
export type AutomatePreprocessingInput = z.infer<typeof AutomatePreprocessingInputSchema>;

const AutomatePreprocessingOutputSchema = z.object({
  preprocessingSteps: z
    .string()
    .describe(
      'A detailed list of preprocessing steps to be performed, including scaling, encoding, and feature selection techniques, tailored to the selected analysis type.'
    ),
});
export type AutomatePreprocessingOutput = z.infer<typeof AutomatePreprocessingOutputSchema>;

export async function automatePreprocessing(
  input: AutomatePreprocessingInput
): Promise<AutomatePreprocessingOutput> {
  return automatePreprocessingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatePreprocessingPrompt',
  input: {schema: AutomatePreprocessingInputSchema},
  output: {schema: AutomatePreprocessingOutputSchema},
  prompt: `You are an expert data scientist specializing in data preprocessing.

You will analyze the dataset description and suggest preprocessing steps tailored to the selected analysis type.

Dataset Description: {{{datasetDescription}}}
Analysis Type: {{{analysisType}}}

Provide a detailed list of preprocessing steps, including scaling, encoding, and feature selection techniques.
`,
});

const automatePreprocessingFlow = ai.defineFlow(
  {
    name: 'automatePreprocessingFlow',
    inputSchema: AutomatePreprocessingInputSchema,
    outputSchema: AutomatePreprocessingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
