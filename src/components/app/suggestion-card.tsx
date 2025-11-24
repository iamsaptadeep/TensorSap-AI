'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ClipboardCheck, Group, Info, Lightbulb, Loader2, TrendingUp, type LucideIcon } from 'lucide-react';
import React from 'react';

interface Suggestion {
  type: string;
  reasoning: string;
}

interface SuggestionCardProps {
  isLoading: boolean;
  isComplete: boolean;
  suggestions: Suggestion[] | null;
  onSelect: (value: string) => void;
  onSubmit: () => void;
  selectedValue: string;
  isDisabled: boolean;
}

const analysisIcons: Record<string, LucideIcon> = {
  Regression: TrendingUp,
  Classification: ClipboardCheck,
  Clustering: Group,
  Default: Lightbulb,
};

export function SuggestionCard({ isLoading, isComplete, suggestions, onSelect, onSubmit, selectedValue, isDisabled }: SuggestionCardProps) {
  if (!isComplete && !isLoading) {
     return (
      <div className="p-4 rounded-lg border-2 border-dashed flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">Analysis Suggestion (Pending)</p>
      </div>
    );
  }

  const submitInProgress = isLoading && isComplete;

  return (
    <Card className={cn('transition-all duration-500 animate-fade-in shadow-md', isLoading && 'border-primary/50')}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          Analysis Suggestions
        </CardTitle>
        <CardDescription>
          Based on your dataset, here are some recommended analysis types.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !isComplete ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <TooltipProvider>
            <RadioGroup onValueChange={onSelect} value={selectedValue} className="gap-4" disabled={isDisabled || submitInProgress}>
              {suggestions?.map((suggestion) => {
                const Icon = analysisIcons[suggestion.type] || analysisIcons.Default;
                return (
                  <div key={suggestion.type} className="flex items-center space-x-2">
                    <RadioGroupItem value={suggestion.type} id={suggestion.type} />
                    <Label
                      htmlFor={suggestion.type}
                      className="flex grow items-center justify-between rounded-md border p-3 hover:bg-muted/50 has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{suggestion.type}</span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{suggestion.reasoning}</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </TooltipProvider>
        )}
      </CardContent>
      {!isDisabled && (
        <CardFooter>
          <Button onClick={onSubmit} className="w-full" disabled={!selectedValue || submitInProgress}>
            {submitInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitInProgress ? 'Processing...' : 'Perform Analysis'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
