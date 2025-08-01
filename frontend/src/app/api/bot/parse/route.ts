import { NextRequest, NextResponse } from 'next/server';
import { botService } from '@/lib/bot';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const parseRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  storeId: z.string().min(1, 'Store ID is required'),
  agentId: z.string().min(1, 'Agent ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, storeId, agentId } = parseRequestSchema.parse(body);

    // Verify store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, error: 'Store not found' },
        { status: 404 }
      );
    }

    // Verify agent exists
    const agent = await prisma.user.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Parse the order request using the bot service
    const parsedOrder = await botService.parseOrderRequest(message, storeId, agentId);

    // Save the bot message
    await botService.saveBotMessage(
      'temp-session', // You might want to create a proper session
      agentId,
      storeId,
      message,
      'USER'
    );

    return NextResponse.json({
      success: true,
      data: parsedOrder,
      message: 'Order parsed successfully',
    });
  } catch (error) {
    console.error('Error parsing order:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to parse order' },
      { status: 500 }
    );
  }
} 