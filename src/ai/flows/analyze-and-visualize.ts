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
    .describe('A structured summary of the key insights and interpretations from the analysis.'),
  visualization: z.string().describe('A textual description of the visualization which includes the chart type (scatter plot, bar chart, or line chart) and a summary of what insights it conveys.'),
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

You have the following information:
- Dataset Description: {{{datasetDescription}}}
- Analysis Type: {{{analysisType}}}
- Preprocessing Steps: {{{preprocessingSteps}}}

Perform the analysis and then provide the output in two parts:

1.  **Analysis Results**: A structured summary of what can be interpreted from the analysis. Use markdown headings and bullet points for clarity. Structure it with the following sections:
    - **Key Findings**: What are the most important takeaways?
    - **Model Performance**: How well did the model perform (if applicable)?
    - **Insights**: What business or practical insights can be derived from the results?

2.  **Visualization**: Based on the analysis type, describe the most appropriate chart.
    - If 'Regression', use a 'scatter plot'.
    - If 'Classification', use a 'bar chart' (e.g., for feature importance).
    - If 'Clustering' or time-series, a 'line chart' might be appropriate.
    - Your description should state the chart type and what it represents. For example: "A bar chart showing the relative importance of each feature in the classification model."`, 
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
