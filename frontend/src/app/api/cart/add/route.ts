import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const addToCartSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export async function POST(request: NextRequest) {
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
    const { itemId, quantity } = addToCartSchema.parse(body);

    // Check if item exists and is available
    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    if (!item.isActive || !item.isAvailable) {
      return NextResponse.json(
        { success: false, error: 'Item is not available' },
        { status: 400 }
      );
    }

    if (item.stockQuantity < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: user.id,
        inventoryItemId: itemId,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (newQuantity > item.stockQuantity) {
        return NextResponse.json(
          { success: false, error: 'Insufficient stock' },
          { status: 400 }
        );
      }

      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          inventoryItem: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedCartItem,
        message: 'Cart updated successfully',
      });
    } else {
      // Add new item to cart
      const newCartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          inventoryItemId: itemId,
          quantity,
        },
        include: {
          inventoryItem: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: newCartItem,
        message: 'Item added to cart successfully',
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
} 