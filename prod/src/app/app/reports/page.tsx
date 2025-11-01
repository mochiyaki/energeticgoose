'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';

interface ReportData {
  totals: {
    totalInvoices: number;
    totalAmount: number;
    contractedCount: number;
    avgDuration: number;
  };
  series: Array<{ week: string; count: number }>;
  distribution: Array<{ name: string; value: number }>;
}

const COLORS = ['#f97316', '#22c55e'];

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await fetch('/api/reports/summary');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load report data
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of your invoice financing activity
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totals.totalInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totals.totalAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Contracted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totals.contractedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.totals.totalInvoices > 0
                ? `${Math.round((data.totals.contractedCount / data.totals.totalInvoices) * 100)}% conversion rate`
                : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totals.avgDuration} days</div>
            <p className="text-xs text-muted-foreground mt-1">Average loan term</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Invoices Per Week
            </CardTitle>
            <CardDescription>Last 8 weeks of invoice uploads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Invoices" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Breakdown by invoice status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Financing Efficiency</p>
                <p className="text-sm text-muted-foreground">
                  {data.totals.contractedCount > 0
                    ? `You've successfully converted ${data.totals.contractedCount} invoices to contracts, unlocking ${formatCurrency(data.totals.totalAmount * 0.8)} in potential financing.`
                    : 'Start converting invoices to contracts to unlock financing.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Cost Savings</p>
                <p className="text-sm text-muted-foreground">
                  With 0% FX markup and ~7% APY, you're saving 3-5% compared to traditional factoring services.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">AI Optimization</p>
                <p className="text-sm text-muted-foreground">
                  Our AI treasury agent continuously monitors your AR/AP to optimize cash flow and suggest improvements.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
