import { prisma } from '@/lib/db';

export interface AIQueryResponse {
  answer: string;
  citations: string[];
  disclaimer: string;
}

export async function mockAIQuery(
  message: string,
  orgId: string
): Promise<AIQueryResponse> {
  const lowerMessage = message.toLowerCase();
  const citations: string[] = [];

  // Search invoices based on keywords
  const invoices = await prisma.invoice.findMany({
    where: { orgId },
    include: {
      contract: true,
    },
    orderBy: { uploadedAt: 'desc' },
  });

  // Simple keyword matching
  if (lowerMessage.includes('how many') || lowerMessage.includes('total')) {
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce(
      (sum, inv) => sum + (inv.amount ? Number(inv.amount) : 0),
      0
    );
    const contracted = invoices.filter((inv) => inv.status === 'CONTRACTED').length;

    return {
      answer: `You have **${totalInvoices} invoices** uploaded with a total value of **$${totalAmount.toLocaleString()}**. Of these, **${contracted} have been converted to contracts**.`,
      citations: invoices.slice(0, 3).map((inv) => inv.id),
      disclaimer: 'This is a demo AI response. No external LLM used.',
    };
  }

  if (lowerMessage.includes('status') || lowerMessage.includes('contracted')) {
    const uploaded = invoices.filter((inv) => inv.status === 'UPLOADED').length;
    const contracted = invoices.filter((inv) => inv.status === 'CONTRACTED').length;

    return {
      answer: `Invoice status breakdown: **${uploaded} uploaded** and awaiting conversion, **${contracted} already contracted**.`,
      citations: invoices.slice(0, 3).map((inv) => inv.id),
      disclaimer: 'This is a demo AI response. No external LLM used.',
    };
  }

  if (lowerMessage.includes('latest') || lowerMessage.includes('recent')) {
    const latest = invoices.slice(0, 3);
    const list = latest
      .map(
        (inv, idx) =>
          `${idx + 1}. ${inv.filename} - $${inv.amount || 'N/A'} (${inv.status})`
      )
      .join('\n');

    return {
      answer: `Here are your latest invoices:\n\n${list}`,
      citations: latest.map((inv) => inv.id),
      disclaimer: 'This is a demo AI response. No external LLM used.',
    };
  }

  if (lowerMessage.includes('contract')) {
    const contracts = await prisma.contract.findMany({
      where: { orgId },
      include: { invoice: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    if (contracts.length === 0) {
      return {
        answer: 'You have no contracts yet. Convert an invoice to create your first contract.',
        citations: [],
        disclaimer: 'This is a demo AI response. No external LLM used.',
      };
    }

    const list = contracts
      .map(
        (c, idx) =>
          `${idx + 1}. Contract ${c.contractId} for ${c.invoice.filename} - $${c.invoice.amount || 'N/A'}`
      )
      .join('\n');

    return {
      answer: `You have **${contracts.length} contracts**:\n\n${list}`,
      citations: contracts.map((c) => c.invoiceId),
      disclaimer: 'This is a demo AI response. No external LLM used.',
    };
  }

  // Default response
  return {
    answer: `I can help you with information about your invoices and contracts. Try asking:
- "How many invoices do I have?"
- "What's the status of my invoices?"
- "Show me my latest invoices"
- "Tell me about my contracts"

Currently, you have **${invoices.length} invoices** in your system.`,
    citations: invoices.slice(0, 2).map((inv) => inv.id),
    disclaimer: 'This is a demo AI response. No external LLM used.',
  };
}
