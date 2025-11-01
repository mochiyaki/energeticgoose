'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { FileText, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface Invoice {
  id: string;
  filename: string;
  amount: number | null;
  status: 'UPLOADED' | 'CONTRACTED';
  uploadedAt: string;
  contract?: {
    contractId: string;
    contractHash: string;
  };
}

interface InvoicesListProps {
  invoices: Invoice[];
  isLoading: boolean;
  onConvertSuccess?: () => void;
  compact?: boolean;
}

export function InvoicesList({
  invoices,
  isLoading,
  onConvertSuccess,
  compact = false,
}: InvoicesListProps) {
  const { toast } = useToast();
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const handleConvert = async (invoiceId: string) => {
    setConvertingId(invoiceId);
    try {
      const response = await fetch('/api/contracts/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed');
      }

      toast({
        title: 'Contract created!',
        description: `Contract ID: ${data.contract.contractId}`,
      });

      onConvertSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Conversion failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setConvertingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No invoices uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {invoice.status === 'CONTRACTED' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{invoice.filename}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatDateTime(invoice.uploadedAt)}</span>
                {invoice.amount && (
                  <>
                    <span>•</span>
                    <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                  </>
                )}
              </div>
              {invoice.contract && !compact && (
                <p className="text-xs text-muted-foreground mt-1">
                  Contract: {invoice.contract.contractId}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {invoice.status === 'UPLOADED' ? (
              <Button
                size="sm"
                onClick={() => handleConvert(invoice.id)}
                disabled={convertingId === invoice.id}
              >
                {convertingId === invoice.id ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Converting...
                  </>
                ) : (
                  'Convert to Contract'
                )}
              </Button>
            ) : (
              <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                Contracted
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
