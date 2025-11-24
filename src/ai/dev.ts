import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-and-visualize.ts';
import '@/ai/flows/automate-preprocessing.ts';
import '@/ai/flows/handle-missing-data.ts';
import '@/ai/flows/generate-eda-report.ts';
import '@/ai/flows/suggest-analysis-types.ts';