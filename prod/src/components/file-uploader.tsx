'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Loader2, File } from 'lucide-react';

interface FileUploaderProps {
  onSuccess?: () => void;
}

export function FileUploader({ onSuccess }: FileUploaderProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [amount, setAmount] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (amount) {
        formData.append('amount', amount);
      }

      const response = await fetch('/api/invoices/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      toast({
        title: 'Success!',
        description: 'Invoice uploaded successfully',
      });

      setSelectedFile(null);
      setAmount('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Invoice File (PDF or Image)</Label>
        <div className="flex gap-2">
          <Input
            id="file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={isUploading}
          />
        </div>
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <File className="w-4 h-4" />
            <span>{selectedFile.name}</span>
            <span className="text-xs">
              ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Invoice Amount (Optional)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="25000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isUploading}
          step="0.01"
          min="0"
        />
        <p className="text-xs text-muted-foreground">
          Enter the invoice amount in USD
        </p>
      </div>

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Invoice
          </>
        )}
      </Button>
    </div>
  );
}
