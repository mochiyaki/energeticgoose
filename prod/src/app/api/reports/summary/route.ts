import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { subWeeks, startOfWeek, endOfWeek, format } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all invoices for the org
    const invoices = await prisma.invoice.findMany({
      where: { orgId: session.user.orgId },
      include: { contract: true },
    });

    // Get all applications
    const applications = await prisma.financingApplication.findMany({
      where: { orgId: session.user.orgId },
    });

    // Calculate totals
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce(
      (sum, inv) => sum + (inv.amount ? Number(inv.amount) : 0),
      0
    );
    const contractedCount = invoices.filter(
      (inv) => inv.status === 'CONTRACTED'
    ).length;
    const avgDuration =
      applications.length > 0
        ? applications.reduce((sum, app) => sum + app.durationDays, 0) /
          applications.length
        : 0;

    // Calculate weekly series (last 8 weeks)
    const series = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);

      const count = invoices.filter((inv) => {
        const uploadDate = new Date(inv.uploadedAt);
        return uploadDate >= weekStart && uploadDate <= weekEnd;
      }).length;

      series.push({
        week: format(weekStart, 'MMM d'),
        count,
      });
    }

    // Status distribution
    const distribution = [
      {
        name: 'Uploaded',
        value: invoices.filter((inv) => inv.status === 'UPLOADED').length,
      },
      {
        name: 'Contracted',
        value: contractedCount,
      },
    ];

    return NextResponse.json({
      totals: {
        totalInvoices,
        totalAmount,
        contractedCount,
        avgDuration: Math.round(avgDuration),
      },
      series,
      distribution,
    });
  } catch (error) {
    console.error('Reports summary error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
