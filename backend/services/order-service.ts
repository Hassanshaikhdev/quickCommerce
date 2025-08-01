import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderService {
  async createOrder(orderData: {
    customerId: string;
    storeId: string;
    items: Array<{
      inventoryItemId: string;
      quantity: number;
      unitPrice: number;
    }>;
    deliveryAddress: string;
    deliveryInstructions?: string;
  }) {
    try {
      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const tax = subtotal * 0.10; // 10% tax
      const deliveryFee = 2.99;
      const total = subtotal + tax + deliveryFee;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber,
          status: 'PENDING',
          subtotal,
          tax,
          deliveryFee,
          total,
          deliveryAddress: orderData.deliveryAddress,
          deliveryInstructions: orderData.deliveryInstructions,
          customerId: orderData.customerId,
          storeId: orderData.storeId,
        },
        include: {
          customer: true,
          store: true,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        orderData.items.map(item =>
          prisma.orderItem.create({
            data: {
              orderId: order.id,
              inventoryItemId: item.inventoryItemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.unitPrice * item.quantity,
            },
            include: {
              inventoryItem: true,
            },
          })
        )
      );

      // Update inventory quantities
      await Promise.all(
        orderData.items.map(item =>
          prisma.inventoryItem.update({
            where: { id: item.inventoryItemId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          })
        )
      );

      return {
        success: true,
        order: {
          ...order,
          items: orderItems,
        },
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: 'Failed to create order',
      };
    }
  }

  async getOrder(orderId: string) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: true,
          store: true,
          items: {
            include: {
              inventoryItem: true,
            },
          },
        },
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Error getting order:', error);
      return {
        success: false,
        error: 'Failed to get order',
      };
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: status as any },
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: 'Failed to update order status',
      };
    }
  }
}

export const orderService = new OrderService(); 