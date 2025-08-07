import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the first active store (you might want to implement store selection logic)
    const store = await prisma.store.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, error: 'No store found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: store,
    });
  } catch (error) {
    console.error('Error fetching default store:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
} 