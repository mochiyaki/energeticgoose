'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { financingApplicationSchema, type FinancingApplicationInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewApplicationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FinancingApplicationInput>({
    resolver: zodResolver(financingApplicationSchema),
    defaultValues: {
      cardBrand: 'Visa',
      cardLast4: '4242',
    },
  });

  const onSubmit = async (data: FinancingApplicationInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create application');
      }

      toast({
        title: 'Application submitted!',
        description: 'Your financing application has been created successfully.',
      });

      router.push('/app');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/app">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">New Financing Application</h1>
        <p className="text-muted-foreground">
          Apply for invoice financing to accelerate your cash flow
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>
            Fill out the form below to apply for financing. All fields are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Acme Industries"
                {...register('companyName')}
                aria-invalid={!!errors.companyName}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-4">Payment Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Card information is for display only. No actual charges will be made in this demo.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cardBrand">Card Brand</Label>
                  <Input
                    id="cardBrand"
                    placeholder="Visa"
                    {...register('cardBrand')}
                    aria-invalid={!!errors.cardBrand}
                  />
                  {errors.cardBrand && (
                    <p className="text-sm text-destructive">{errors.cardBrand.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardLast4">Last 4 Digits</Label>
                  <Input
                    id="cardLast4"
                    placeholder="4242"
                    maxLength={4}
                    {...register('cardLast4')}
                    aria-invalid={!!errors.cardLast4}
                  />
                  {errors.cardLast4 && (
                    <p className="text-sm text-destructive">{errors.cardLast4.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceAmount">Invoice Amount (USD)</Label>
              <Input
                id="invoiceAmount"
                type="number"
                placeholder="50000"
                step="0.01"
                min="0"
                {...register('invoiceAmount')}
                aria-invalid={!!errors.invoiceAmount}
              />
              {errors.invoiceAmount && (
                <p className="text-sm text-destructive">{errors.invoiceAmount.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                You'll receive up to 80% advance at ~7% APY
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationDays">Loan Duration (Days)</Label>
              <Input
                id="durationDays"
                type="number"
                placeholder="90"
                min="7"
                max="360"
                {...register('durationDays')}
                aria-invalid={!!errors.durationDays}
              />
              {errors.durationDays && (
                <p className="text-sm text-destructive">{errors.durationDays.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Between 7 and 360 days
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Estimated Terms</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Advance Rate: Up to 80% of invoice value</li>
                <li>• Interest Rate: ~7% APY</li>
                <li>• FX Markup: 0% on cross-border settlements</li>
                <li>• Processing Time: Instant upon contract creation</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/app')}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
