import { BrainCircuit } from 'lucide-react';
import React from 'react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tighter text-foreground">
            TensorSap AI
          </h1>
        </div>
      </div>
    </header>
  );
}
