import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';
import { signupSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 10);

    // Create organization and user in a transaction
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      const org = await tx.organization.create({
        data: {
          name: validated.orgName,
        },
      });

      const user = await tx.user.create({
        data: {
          orgId: org.id,
          email: validated.email,
          name: validated.name || null,
          passwordHash,
        },
      });

      return { org, user };
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        orgId: result.org.id,
        orgName: result.org.name,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
