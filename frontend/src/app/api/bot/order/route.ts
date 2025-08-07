import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { botService } from '@/lib/bot';
import { z } from 'zod';

const createOrderSchema = z.object({
  agentId: z.string().min(1, 'Agent ID is required'),
  storeId: z.string().min(1, 'Store ID is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  items: z.array(z.object({
    itemId: z.string().min(1, 'Item ID is required'),
    quantity: z.number().positive('Quantity must be positive'),
    notes: z.string().optional(),
  })),
  deliveryAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET']).default('CASH_ON_DELIVERY'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const orderData = createOrderSchema.parse(body);

    // Verify all entities exist
    const [agent, store, customer] = await Promise.all([
      prisma.user.findUnique({ where: { id: orderData.agentId } }),
      prisma.store.findUnique({ where: { id: orderData.storeId } }),
      prisma.user.findUnique({ where: { id: orderData.customerId } }),
    ]);

    if (!agent || !store || !customer) {
      return NextResponse.json(
        { success: false, error: 'Invalid agent, store, or customer ID' },
        { status: 404 }
      );
    }

    // Verify items exist and check availability
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        id: { in: orderData.items.map(item => item.itemId) },
        storeId: orderData.storeId,
        isActive: true,
      },
    });

    if (inventoryItems.length !== orderData.items.length) {
      return NextResponse.json(
        { success: false, error: 'Some items not found in store inventory' },
        { status: 400 }
      );
    }

    // Check stock availability
    const stockIssues = orderData.items.filter(orderItem => {
      const inventoryItem = inventoryItems.find((item:any) => item.id === orderItem.itemId);
      return !inventoryItem || inventoryItem.stockQuantity < orderItem.quantity;
    });

    if (stockIssues.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient stock for some items',
          stockIssues 
        },
        { status: 400 }
      );
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const orderItem of orderData.items) {
      const inventoryItem = inventoryItems.find((item:any) => item.id === orderItem.itemId);
      if (!inventoryItem) continue;

      const itemTotal = Number(inventoryItem.price) * orderItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        inventoryItemId: orderItem.itemId,
        quantity: orderItem.quantity,
        unitPrice: Number(inventoryItem.price),
        total: itemTotal,
        notes: orderItem.notes,
      });
    }

    // Calculate additional costs
    const tax = subtotal * 0.05; // 5% tax
    const deliveryFee = subtotal > 500 ? 0 : 50; // Free delivery above ₹500
    const total = subtotal + tax + deliveryFee;

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        customerId: orderData.customerId,
        storeId: orderData.storeId,
        status: 'PENDING',
        subtotal,
        tax,
        deliveryFee,
        total,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: 'PENDING',
        deliveryAddress: `${orderData.deliveryAddress.street}, ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} ${orderData.deliveryAddress.zipCode}`,
        deliveryInstructions: orderData.deliveryInstructions,
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            inventoryItem: true,
          },
        },
        customer: {
          select: { name: true, email: true, phone: true },
        },
        store: {
          select: { name: true, phone: true },
        },
      },
    });

    // Update inventory quantities
    for (const orderItem of orderData.items) {
      await prisma.inventoryItem.update({
        where: { id: orderItem.itemId },
        data: {
          stockQuantity: {
            decrement: orderItem.quantity,
          },
        },
      });
    }

    // Generate bot response
    const botResponse = `Order created successfully! Order ID: ${order.orderNumber}. Total: ₹${total.toFixed(2)}. Estimated delivery: 30 minutes.`;

    // Save bot response (optional)
    try {
      await botService.saveBotMessage(
        `session-${Date.now()}`, // Create a unique session ID
        orderData.agentId,
        orderData.storeId,
        botResponse,
        'BOT'
      );
    } catch (error) {
      console.error('Error saving bot response:', error);
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        botResponse,
      },
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 