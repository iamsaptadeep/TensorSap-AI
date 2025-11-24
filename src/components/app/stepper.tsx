import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  icon: LucideIcon;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Analysis Pipeline</h2>
      <nav aria-label="Analysis Steps">
        <ol className="space-y-1">
          {steps.map((step, index) => {
            const status =
              index < currentStep
                ? 'completed'
                : index === currentStep
                ? 'current'
                : 'upcoming';

            return (
              <li key={step.title} className="flex items-center gap-4 py-2">
                <div
                  className={cn(
                    'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                    status === 'completed' && 'bg-primary text-primary-foreground',
                    status === 'current' && 'border-2 border-primary bg-primary/10 text-primary',
                    status === 'upcoming' && 'bg-card border-dashed border-2 text-muted-foreground'
                  )}
                  aria-hidden="true"
                >
                  {status === 'completed' ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{`Step ${index + 1}`}</span>
                  <span
                    className={cn(
                      'font-medium transition-colors',
                      status === 'current' && 'text-primary',
                      status === 'upcoming' && 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
