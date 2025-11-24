'use client';

import { useState, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  UploadCloud,
  Wand2,
  LayoutGrid,
  Lightbulb,
  Settings2,
  BarChart,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { AppHeader } from '@/components/app/header';
import { Stepper } from '@/components/app/stepper';
import { FileUploadCard } from '@/components/app/file-upload-card';
import { ResultCard } from '@/components/app/result-card';
import { SuggestionCard } from '@/components/app/suggestion-card';
import { AnalysisVisualizationCard } from '@/components/app/analysis-visualization-card';

// AI Flow Imports (we will mock their functionality for now)
import { handleMissingData } from '@/ai/flows/handle-missing-data';
import { generateEdaReport } from '@/ai/flows/generate-eda-report';
import { suggestAnalysisTypes } from '@/ai/flows/suggest-analysis-types';
import { automatePreprocessing } from '@/ai/flows/automate-preprocessing';
import { analyzeAndVisualize } from '@/ai/flows/analyze-and-visualize';

interface StepInfo {
  title: string;
  icon: LucideIcon;
}

const analysisSteps: StepInfo[] = [
  { title: 'Upload Dataset', icon: UploadCloud },
  { title: 'Data Cleaning', icon: Wand2 },
  { title: 'EDA', icon: LayoutGrid },
  { title: 'Analysis Suggestion', icon: Lightbulb },
  { title: 'Preprocessing', icon: Settings2 },
  { title: 'Analysis & Visualization', icon: BarChart },
];

interface AnalysisResults {
  cleaning?: string;
  eda?: string;
  suggestions?: { type: string; reasoning: string }[];
  preprocessing?: string;
  analysis?: { analysisResults: string; visualization: string };
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [results, setResults] = useState<AnalysisResults>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');
  const { toast } = useToast();

  const setStepLoading = (step: number, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [step]: isLoading }));
  };

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setCurrentStep(1);

    try {
      const content = await uploadedFile.text();
      setFileContent(content);

      // --- Data Cleaning ---
      setStepLoading(1, true);
      // const cleaningResult = await handleMissingData({ dataset: content });
      await new Promise(res => setTimeout(res, 1500)); // mock delay
      const cleaningResult = { report: "Handled 27 missing values in 'age' column using median imputation. Removed 3 duplicate rows." };
      setResults((prev) => ({ ...prev, cleaning: cleaningResult.report }));
      setStepLoading(1, false);
      setCurrentStep(2);

      // --- EDA ---
      setStepLoading(2, true);
      // const edaResult = await generateEdaReport({ datasetDescription: "User uploaded CSV", datasetSample: content.slice(0, 500) });
      await new Promise(res => setTimeout(res, 2000)); // mock delay
      const edaResult = { edaReport: "Dataset contains 10 columns and 1054 rows. Key columns include 'age', 'income', and 'purchase_status'. 'income' is right-skewed. Strong positive correlation between 'age' and 'income'." };
      setResults((prev) => ({ ...prev, eda: edaResult.edaReport }));
      setStepLoading(2, false);
      setCurrentStep(3);

      // --- Analysis Suggestions ---
      setStepLoading(3, true);
      // const suggestionsResult = await suggestAnalysisTypes({ datasetDescription: "User uploaded CSV" });
      await new Promise(res => setTimeout(res, 2000)); // mock delay
      const suggestionsResult = {
        suggestedAnalysisTypes: ["Regression", "Classification", "Clustering"],
        reasoning: "Regression can predict 'income' from 'age'. Classification can predict 'purchase_status'. Clustering can find customer segments."
      };
      const suggestions = suggestionsResult.suggestedAnalysisTypes.map(type => ({ type, reasoning: suggestionsResult.reasoning }));
      setResults((prev) => ({ ...prev, suggestions }));
      setStepLoading(3, false);
      
    } catch (error) {
      console.error("Analysis pipeline error:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong during the analysis. Please try again.",
      });
      // Reset state
      setCurrentStep(0);
      setFile(null);
    }
  };

  const handleAnalysisSelection = async () => {
    if (!selectedAnalysis) {
      toast({
        variant: "destructive",
        title: "No Analysis Selected",
        description: "Please select an analysis type to proceed.",
      });
      return;
    }
    setCurrentStep(4);

    try {
      // --- Preprocessing ---
      setStepLoading(4, true);
      // const preprocessingResult = await automatePreprocessing({ datasetDescription: "User uploaded CSV", analysisType: selectedAnalysis });
      await new Promise(res => setTimeout(res, 1500)); // mock delay
      const preprocessingResult = { preprocessingSteps: `For ${selectedAnalysis}: Standard scaling applied to numerical features. One-hot encoding applied to categorical features.`};
      setResults((prev) => ({ ...prev, preprocessing: preprocessingResult.preprocessingSteps }));
      setStepLoading(4, false);
      setCurrentStep(5);

      // --- Final Analysis & Visualization ---
      setStepLoading(5, true);
      // const finalResult = await analyzeAndVisualize({ ... });
      await new Promise(res => setTimeout(res, 2500)); // mock delay
      const finalResult = {
        analysisResults: `The ${selectedAnalysis} model achieved an accuracy of 92%. Key predictors were 'income' and 'age'.`,
        visualization: "A bar chart showing feature importance. 'Income' is the most important feature, followed by 'age'."
      };
      setResults((prev) => ({ ...prev, analysis: finalResult }));
      setStepLoading(5, false);

    } catch (error) {
      console.error("Post-selection analysis error:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong during the final analysis. Please try again.",
      });
      // Allow user to retry from suggestion step
      setCurrentStep(3);
    }
  };


  const isStepComplete = (stepIndex: number) => currentStep > stepIndex;
  const isStepCurrent = (stepIndex: number) => currentStep === stepIndex;
  
  const initialUploadInProgress = file !== null && currentStep < 3 && loadingStates[currentStep];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppHeader />
      <main className="container mx-auto flex-1 p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <aside className="hidden md:block">
            <Stepper currentStep={currentStep} steps={analysisSteps} />
          </aside>
          <section className="flex flex-col gap-6">
            {currentStep === 0 && (
              <FileUploadCard
                onFileUpload={handleFileUpload}
                isLoading={loadingStates[0] || false}
              />
            )}

            {currentStep > 0 && (
              <ResultCard
                title="Dataset"
                icon={UploadCloud}
                isLoading={false}
                isComplete={true}
                content={<p className='font-mono p-2 bg-muted rounded-md'>{file?.name}</p>}
              />
            )}
            
            <ResultCard
              title="Data Cleaning Report"
              icon={Wand2}
              isLoading={loadingStates[1] || false}
              isComplete={isStepComplete(1) || isStepCurrent(1)}
              content={results.cleaning}
            />

            <ResultCard
              title="Exploratory Data Analysis (EDA)"
              icon={LayoutGrid}
              isLoading={loadingStates[2] || false}
              isComplete={isStepComplete(2) || isStepCurrent(2)}
              content={results.eda}
            />
            
            <SuggestionCard
              isLoading={loadingStates[3] || false}
              isComplete={isStepComplete(2)}
              suggestions={results.suggestions || null}
              onSelect={setSelectedAnalysis}
              onSubmit={handleAnalysisSelection}
              selectedValue={selectedAnalysis}
              isDisabled={currentStep > 3}
            />

            <ResultCard
              title="Preprocessing Steps"
              icon={Settings2}
              isLoading={loadingStates[4] || false}
              isComplete={isStepComplete(4) || isStepCurrent(4)}
              content={results.preprocessing}
            />

            <AnalysisVisualizationCard
              isLoading={loadingStates[5] || false}
              isComplete={isStepComplete(5) || isStepCurrent(5)}
              analysisResults={results.analysis?.analysisResults}
              visualizationDescription={results.analysis?.visualization}
            />

          </section>
        </div>
      </main>
    </div>
  );
}
