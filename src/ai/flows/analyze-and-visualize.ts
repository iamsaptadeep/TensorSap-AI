'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing a selected analysis type on a dataset and visualizing the results.
 *
 * - analyzeAndVisualize - A function that performs the analysis and visualization.
 * - AnalyzeAndVisualizeInput - The input type for the analyzeAndVisualize function.
 * - AnalyzeAndVisualizeOutput - The return type for the analyzeAndVisualize function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAndVisualizeInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('Description of the dataset, including column names and types.'),
  analysisType: z
    .string()
    .describe(
      'The type of analysis to perform (e.g., regression, classification, clustering).' + 
      'Must be one of the analysis types previously suggested to the user.'
    ),
  preprocessingSteps: z
    .string()
    .describe(
      'Description of the preprocessing steps performed on the dataset (e.g., scaling, encoding).' + 
      'These are the steps that the user has approved based on suggestions.'
    ),
  modelExplanation: z
    .string()
    .describe('Explanation of the analysis model to the user.'),
  visualizationType: z
    .string()
    .describe('The type of chart or graph to use for visualization (e.g., scatter plot, bar chart, histogram).'),
});
export type AnalyzeAndVisualizeInput = z.infer<typeof AnalyzeAndVisualizeInputSchema>;

const AnalyzeAndVisualizeOutputSchema = z.object({
  analysisResults: z
    .string()
    .describe('A summary of the results of the analysis.'),
  visualization: z.string().describe('A textual description of the visualization which includes the chart type and a summary of what insights it conveys.'),
});

export type AnalyzeAndVisualizeOutput = z.infer<typeof AnalyzeAndVisualizeOutputSchema>;

export async function analyzeAndVisualize(
  input: AnalyzeAndVisualizeInput
): Promise<AnalyzeAndVisualizeOutput> {
  return analyzeAndVisualizeFlow(input);
}

const analyzeAndVisualizePrompt = ai.definePrompt({
  name: 'analyzeAndVisualizePrompt',
  input: {schema: AnalyzeAndVisualizeInputSchema},
  output: {schema: AnalyzeAndVisualizeOutputSchema},
  prompt: `You are an expert data scientist who performs data analysis and visualizes the results.

You have the following information about the dataset and the analysis to perform:

Dataset Description: {{{datasetDescription}}}

Analysis Type: {{{analysisType}}}

Preprocessing Steps: {{{preprocessingSteps}}}

Model Explanation: {{{modelExplanation}}}

Visualization Type: {{{visualizationType}}}

Based on this information, perform the analysis and create a visualization.

Return both a summary of the analysis results and a textual description of the visualization.

Analysis Results:

Visualization Description:`, 
});

const analyzeAndVisualizeFlow = ai.defineFlow(
  {
    name: 'analyzeAndVisualizeFlow',
    inputSchema: AnalyzeAndVisualizeInputSchema,
    outputSchema: AnalyzeAndVisualizeOutputSchema,
  },
  async input => {
    const {output} = await analyzeAndVisualizePrompt(input);
    return output!;
  }
);
