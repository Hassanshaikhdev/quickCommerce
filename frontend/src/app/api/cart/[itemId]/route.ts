import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const updateCartItemSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    // Authenticate user
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { quantity } = updateCartItemSchema.parse(body);

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        userId: user.id,
      },
      include: {
        inventoryItem: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    if (quantity > cartItem.inventoryItem.stockQuantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity },
      include: {
        inventoryItem: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            unit: true,
            stockQuantity: true,
            isAvailable: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCartItem,
      message: 'Cart item updated successfully',
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    // Authenticate user
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        userId: user.id,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: params.itemId },
    });

    return NextResponse.json({
      success: true,
      message: 'Cart item removed successfully',
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
} 