import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateRandomString } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID required' },
        { status: 400 }
      );
    }

    // Verify invoice belongs to user's org
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        orgId: session.user.orgId,
      },
      include: {
        contract: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.contract) {
      return NextResponse.json(
        { error: 'Invoice already has a contract' },
        { status: 400 }
      );
    }

    // Create contract and update invoice status in transaction
    const result = await prisma.$transaction(async (tx) => {
      const contract = await tx.contract.create({
        data: {
          orgId: session.user.orgId,
          invoiceId: invoice.id,
          contractId: `EG-${invoice.id.slice(0, 6).toUpperCase()}`,
          contractHash: `cid_${generateRandomString(15)}`,
        },
      });

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoice.id },
        data: { status: 'CONTRACTED' },
      });

      return { contract, invoice: updatedInvoice };
    });

    return NextResponse.json({
      success: true,
      contract: result.contract,
      invoice: result.invoice,
    });
  } catch (error) {
    console.error('Contract conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert to contract' },
      { status: 500 }
    );
  }
}
