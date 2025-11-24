import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface ResultCardProps {
  title: string;
  icon: LucideIcon;
  isLoading: boolean;
  isComplete: boolean;
  content?: React.ReactNode;
}

export function ResultCard({ title, icon: Icon, isLoading, isComplete, content }: ResultCardProps) {
  if (!isComplete && !isLoading) {
    return (
      <div className="p-4 rounded-lg border-2 border-dashed flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">{title} (Pending)</p>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        'transition-all duration-500 animate-fade-in shadow-md',
        isLoading ? 'border-primary/50' : ''
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div className="text-sm text-foreground/80 leading-relaxed">{content}</div>
        )}
      </CardContent>
    </Card>
  );
}
