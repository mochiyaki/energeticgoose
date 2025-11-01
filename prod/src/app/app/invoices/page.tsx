'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoicesList } from '@/components/invoices-list';
import { useToast } from '@/components/ui/use-toast';
import { FileText } from 'lucide-react';

export default function InvoicesPage() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices/upload');
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invoices',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleConvertSuccess = () => {
    toast({
      title: 'Contract created!',
      description: 'Invoice has been converted to a contract.',
    });
    fetchInvoices();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Invoices</h1>
        <p className="text-muted-foreground">
          Manage all your uploaded invoices and convert them to contracts
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {invoices.filter((inv) => inv.status === 'UPLOADED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Contracted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {invoices.filter((inv) => inv.status === 'CONTRACTED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Invoices
          </CardTitle>
          <CardDescription>
            View and manage all your uploaded invoices. Convert uploaded invoices to contracts to
            receive financing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoicesList
            invoices={invoices}
            isLoading={isLoading}
            onConvertSuccess={handleConvertSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
