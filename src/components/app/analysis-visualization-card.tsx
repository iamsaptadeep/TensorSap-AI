'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { BarChart, Eye, LineChart, ScatterChart as ScatterChartIcon } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Scatter, ScatterChart as RechartsScatterChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface AnalysisVisualizationCardProps {
  isLoading: boolean;
  isComplete: boolean;
  analysisResults?: string;
  visualizationDescription?: string;
}

const mockBarData = [
  { name: 'Income', importance: 4000 },
  { name: 'Age', importance: 3000 },
  { name: 'Last Purchase', importance: 2000 },
  { name: 'Gender', importance: 2780 },
  { name: 'Region', importance: 1890 },
];
const mockLineData = [
  { month: 'Jan', sales: 400 },
  { month: 'Feb', sales: 300 },
  { month: 'Mar', sales: 600 },
  { month: 'Apr', sales: 800 },
  { month: 'May', sales: 500 },
];
const mockScatterData = [
  { x: 100, y: 200 },
  { x: 120, y: 100 },
  { x: 170, y: 300 },
  { x: 140, y: 250 },
  { x: 150, y: 400 },
  { x: 110, y: 280 },
];


const ChartComponent = ({ description }: { description?: string }) => {
  const chartType = description?.toLowerCase().includes('bar') ? 'bar'
                  : description?.toLowerCase().includes('line') ? 'line'
                  : description?.toLowerCase().includes('scatter') ? 'scatter'
                  : 'bar'; // Default to bar chart

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={mockBarData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
          <Legend />
          <Bar dataKey="importance" fill="hsl(var(--primary))" name="Feature Importance" />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={mockLineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" name="Monthly Sales" />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }
  
  if (chartType === 'scatter') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" dataKey="x" name="stature" unit="cm" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis type="number" dataKey="y" name="weight" unit="kg" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}/>
          <Legend/>
          <Scatter name="Customer Data" data={mockScatterData} fill="hsl(var(--primary))" />
        </RechartsScatterChart>
      </ResponsiveContainer>
    );
  }

  return null;
}


export function AnalysisVisualizationCard({
  isLoading,
  isComplete,
  analysisResults,
  visualizationDescription,
}: AnalysisVisualizationCardProps) {
  if (!isComplete && !isLoading) {
      return (
      <div className="p-4 rounded-lg border-2 border-dashed flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <BarChart className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">Analysis & Visualization (Pending)</p>
      </div>
    );
  }

  return (
    <Card className={cn('transition-all duration-500 animate-fade-in shadow-md', isLoading && 'border-primary/50')}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart className="h-5 w-5 text-primary" />
          Final Analysis & Visualization
        </CardTitle>
        <CardDescription>
          The results of the selected analysis and a visual representation of key findings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div>
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-64 w-full mt-6" />
          </div>
        ) : (
          <>
            <div>
              <h3 className="font-semibold text-md mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Analysis Results
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {analysisResults || "No analysis results available."}
              </p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-md flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    Visualization
                </h3>
                 <p className="text-sm text-foreground/80 leading-relaxed italic">
                    "{visualizationDescription || "No visualization description available."}"
                </p>
                <div className="h-80 w-full pt-4">
                  <ChartComponent description={visualizationDescription} />
                </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
