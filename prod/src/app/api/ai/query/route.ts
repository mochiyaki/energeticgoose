import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { mockAIQuery } from '@/lib/ai/mock';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        orgId: session.user.orgId,
        userId: session.user.id,
        role: 'user',
        content: message,
      },
    });

    // Get AI response
    const response = await mockAIQuery(message, session.user.orgId);

    // Save assistant response
    await prisma.chatMessage.create({
      data: {
        orgId: session.user.orgId,
        userId: session.user.id,
        role: 'assistant',
        content: response.answer,
      },
    });

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error('AI query error:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
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

    const messages = await prisma.chatMessage.findMany({
      where: {
        orgId: session.user.orgId,
        userId: session.user.id,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
