'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileUploader } from '@/components/file-uploader';
import { InvoicesList } from '@/components/invoices-list';
import { ChatBox } from '@/components/chat-box';
import { StatsCards } from '@/components/stats-cards';
import { Upload, FileCheck, MessageSquare, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleUploadSuccess = () => {
    toast({
      title: 'Invoice uploaded!',
      description: 'Your invoice has been successfully uploaded.',
    });
    fetchInvoices();
  };

  const handleConvertSuccess = () => {
    toast({
      title: 'Contract created!',
      description: 'Invoice has been converted to a contract.',
    });
    fetchInvoices();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your invoices, contracts, and treasury operations
        </p>
      </div>

      <StatsCards />

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="gap-2">
            <FileCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Invoices</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Invoice</CardTitle>
              <CardDescription>
                Upload your invoice (PDF or image) to get started with financing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Your most recently uploaded invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoicesList
                invoices={invoices.slice(0, 5)}
                isLoading={isLoading}
                onConvertSuccess={handleConvertSuccess}
                compact
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>
                View and manage all your uploaded invoices and contracts
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
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>AI Treasury Assistant</CardTitle>
              <CardDescription>
                Ask questions about your invoices, contracts, and treasury operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatBox />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Overview of your financing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Invoices</span>
                    <span className="text-2xl font-bold">{invoices.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Contracted</span>
                    <span className="text-2xl font-bold">
                      {invoices.filter((inv) => inv.status === 'CONTRACTED').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending</span>
                    <span className="text-2xl font-bold">
                      {invoices.filter((inv) => inv.status === 'UPLOADED').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/app/new">Create New Financing Application</a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/app/reports">View Detailed Reports</a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/app/settings">Configure Settings</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
