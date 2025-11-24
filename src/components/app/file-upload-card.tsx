'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import React, { useState } from 'react';

interface FileUploadCardProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export function FileUploadCard({ onFileUpload, isLoading }: FileUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      
      if (allowedTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a CSV or Excel (.xlsx) file.',
        });
        event.target.value = ''; // Reset file input
      }
    }
  };

  const handleUploadClick = () => {
    if (file) {
      onFileUpload(file);
    } else {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a file to upload.',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if(e.dataTransfer.files && e.dataTransfer.files[0]){
      const droppedFile = e.dataTransfer.files[0];
      // Manually create a ChangeEvent-like object for handleFileChange
      const mockEvent = { target: { files: [droppedFile] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(mockEvent);
    }
  }

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-6 w-6 text-primary" />
          Start Your Analysis
        </CardTitle>
        <CardDescription>
          Upload your dataset to begin the automated analysis pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <label 
            className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm font-semibold">
                {file ? file.name : 'Click to browse or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground">CSV or XLSX</p>
            </div>
            <Input
              id="dropzone-file"
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </label>
          <Button
            onClick={handleUploadClick}
            disabled={isLoading || !file}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Start Analysis'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
