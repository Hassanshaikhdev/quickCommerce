import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get or create a default agent
    let agent = await prisma.user.findFirst({
      where: {
        role: 'AGENT',
        isActive: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!agent) {
      // Create a default agent if none exists
      const hashedPassword = await hashPassword('default-password');
      agent = await prisma.user.create({
        data: {
          email: 'agent@quickcommerce.com',
          name: 'AI Assistant',
          password: hashedPassword,
          role: 'AGENT',
          isActive: true,
        },
      });
    }

    // Remove password from response
    const { password, ...agentWithoutPassword } = agent;

    return NextResponse.json({
      success: true,
      data: agentWithoutPassword,
    });
  } catch (error) {
    console.error('Error fetching default agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
} 