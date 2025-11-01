import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { financingApplicationSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = financingApplicationSchema.parse(body);

    const application = await prisma.financingApplication.create({
      data: {
        orgId: session.user.orgId,
        userId: session.user.id,
        companyName: validated.companyName,
        cardBrand: validated.cardBrand,
        cardLast4: validated.cardLast4,
        cardTokenStub: 'tok_demo_****',
        invoiceAmount: validated.invoiceAmount,
        durationDays: validated.durationDays,
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error('Application creation error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await prisma.financingApplication.findMany({
      where: { orgId: session.user.orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
