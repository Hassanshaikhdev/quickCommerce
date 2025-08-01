import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.botMessage.deleteMany();
  await prisma.botSession.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create users with different roles
  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@quickcommerce.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const storeManager = await prisma.user.create({
    data: {
      email: 'manager@quickcommerce.com',
      password: hashedPassword,
      name: 'Store Manager',
      role: 'STORE_MANAGER',
    },
  });

  const deliveryAgent = await prisma.user.create({
    data: {
      email: 'delivery@quickcommerce.com',
      password: hashedPassword,
      name: 'Delivery Agent',
      role: 'DELIVERY_AGENT',
    },
  });

  const botAgent = await prisma.user.create({
    data: {
      email: 'bot@quickcommerce.com',
      password: hashedPassword,
      name: 'AI Bot Agent',
      role: 'AGENT',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@quickcommerce.com',
      password: hashedPassword,
      name: 'John Customer',
      role: 'CUSTOMER',
    },
  });

  console.log('👥 Created users');

  // Create store
  const store = await prisma.store.create({
    data: {
      name: 'QuickMart Express',
      description: 'Your neighborhood quick commerce store',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1-555-0123',
      email: 'contact@quickmart.com',
      managerId: storeManager.id,
    },
  });

  console.log('🏪 Created store');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Fruits & Vegetables',
        description: 'Fresh fruits and vegetables',
        storeId: store.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dairy & Eggs',
        description: 'Fresh dairy products and eggs',
        storeId: store.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bread & Bakery',
        description: 'Fresh bread and bakery items',
        storeId: store.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beverages',
        description: 'Soft drinks, juices, and other beverages',
        storeId: store.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Snacks',
        description: 'Chips, cookies, and other snacks',
        storeId: store.id,
      },
    }),
  ]);

  console.log('📂 Created categories');

  // Create inventory items
  const inventoryItems = await Promise.all([
    // Fruits & Vegetables
    prisma.inventoryItem.create({
      data: {
        name: 'Fresh Apples',
        description: 'Sweet and crisp red apples',
        sku: 'FRUITS-APPLE-001',
        barcode: '1234567890123',
        price: 2.99,
        costPrice: 1.50,
        stockQuantity: 50,
        minStockLevel: 10,
        unit: 'kg',
        weight: 1000,
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'],
        categoryId: categories[0].id,
        storeId: store.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Organic Bananas',
        description: 'Fresh organic bananas',
        sku: 'FRUITS-BANANA-001',
        barcode: '1234567890124',
        price: 1.99,
        costPrice: 0.80,
        stockQuantity: 75,
        minStockLevel: 15,
        unit: 'kg',
        weight: 1000,
        images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e'],
        categoryId: categories[0].id,
        storeId: store.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Fresh Tomatoes',
        description: 'Ripe red tomatoes',
        sku: 'VEG-TOMATO-001',
        barcode: '1234567890125',
        price: 3.49,
        costPrice: 1.75,
        stockQuantity: 30,
        minStockLevel: 8,
        unit: 'kg',
        weight: 1000,
        images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337'],
        categoryId: categories[0].id,
        storeId: store.id,
      },
    }),

    // Dairy & Eggs
    prisma.inventoryItem.create({
      data: {
        name: 'Fresh Milk',
        description: 'Whole milk, 1 liter',
        sku: 'DAIRY-MILK-001',
        barcode: '1234567890126',
        price: 2.49,
        costPrice: 1.20,
        stockQuantity: 40,
        minStockLevel: 12,
        unit: 'liters',
        weight: 1000,
        images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150'],
        categoryId: categories[1].id,
        storeId: store.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Fresh Eggs',
        description: 'Farm fresh eggs, 12 count',
        sku: 'DAIRY-EGGS-001',
        barcode: '1234567890127',
        price: 4.99,
        costPrice: 2.50,
        stockQuantity: 25,
        minStockLevel: 6,
        unit: 'dozen',
        weight: 600,
        images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f'],
        categoryId: categories[1].id,
        storeId: store.id,
      },
    }),

    // Bread & Bakery
    prisma.inventoryItem.create({
      data: {
        name: 'Whole Wheat Bread',
        description: 'Fresh whole wheat bread',
        sku: 'BAKERY-BREAD-001',
        barcode: '1234567890128',
        price: 3.99,
        costPrice: 1.80,
        stockQuantity: 20,
        minStockLevel: 5,
        unit: 'loaf',
        weight: 500,
        images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff'],
        categoryId: categories[2].id,
        storeId: store.id,
      },
    }),

    // Beverages
    prisma.inventoryItem.create({
      data: {
        name: 'Orange Juice',
        description: 'Fresh orange juice, 1 liter',
        sku: 'BEV-JUICE-001',
        barcode: '1234567890129',
        price: 3.99,
        costPrice: 2.00,
        stockQuantity: 35,
        minStockLevel: 10,
        unit: 'liters',
        weight: 1000,
        images: ['https://images.unsplash.com/photo-1621506289937-a8e4df240d0b'],
        categoryId: categories[3].id,
        storeId: store.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Coca Cola',
        description: 'Coca Cola, 2 liter bottle',
        sku: 'BEV-COLA-001',
        barcode: '1234567890130',
        price: 2.49,
        costPrice: 1.25,
        stockQuantity: 45,
        minStockLevel: 12,
        unit: 'bottles',
        weight: 2000,
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'],
        categoryId: categories[3].id,
        storeId: store.id,
      },
    }),

    // Snacks
    prisma.inventoryItem.create({
      data: {
        name: 'Potato Chips',
        description: 'Classic potato chips, 200g',
        sku: 'SNACK-CHIPS-001',
        barcode: '1234567890131',
        price: 2.99,
        costPrice: 1.50,
        stockQuantity: 60,
        minStockLevel: 15,
        unit: 'bags',
        weight: 200,
        images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b'],
        categoryId: categories[4].id,
        storeId: store.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Chocolate Cookies',
        description: 'Delicious chocolate cookies, 300g',
        sku: 'SNACK-COOKIES-001',
        barcode: '1234567890132',
        price: 4.49,
        costPrice: 2.25,
        stockQuantity: 30,
        minStockLevel: 8,
        unit: 'packets',
        weight: 300,
        images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e'],
        categoryId: categories[4].id,
        storeId: store.id,
      },
    }),
  ]);

  console.log('📦 Created inventory items');

  // Create a sample order
  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      status: 'CONFIRMED',
      subtotal: 15.95,
      tax: 1.60,
      deliveryFee: 2.99,
      total: 20.54,
      deliveryAddress: '456 Oak Street, New York, NY 10002',
      deliveryInstructions: 'Please ring the doorbell',
      customerId: customer.id,
      storeId: store.id,
    },
  });

  // Create order items
  await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: order.id,
        inventoryItemId: inventoryItems[0].id, // Apples
        quantity: 2,
        unitPrice: 2.99,
        total: 5.98,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order.id,
        inventoryItemId: inventoryItems[3].id, // Milk
        quantity: 1,
        unitPrice: 2.49,
        total: 2.49,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order.id,
        inventoryItemId: inventoryItems[5].id, // Bread
        quantity: 1,
        unitPrice: 3.99,
        total: 3.99,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order.id,
        inventoryItemId: inventoryItems[8].id, // Chips
        quantity: 1,
        unitPrice: 2.99,
        total: 2.99,
      },
    }),
  ]);

  console.log('📋 Created sample order');

  // Create a bot session
  const botSession = await prisma.botSession.create({
    data: {
      sessionId: 'BOT-SESSION-001',
      status: 'ACTIVE',
      agentId: botAgent.id,
      orderId: order.id,
    },
  });

  // Create bot messages
  await Promise.all([
    prisma.botMessage.create({
      data: {
        sessionId: botSession.id,
        content: 'Hello! I need to place an order for some groceries.',
        type: 'USER',
        metadata: {
          parsedItems: [
            { name: 'apples', quantity: 2, unit: 'kg' },
            { name: 'milk', quantity: 1, unit: 'liter' },
            { name: 'bread', quantity: 1, unit: 'loaf' },
            { name: 'chips', quantity: 1, unit: 'bag' },
          ],
        },
      },
    }),
    prisma.botMessage.create({
      data: {
        sessionId: botSession.id,
        content: 'I\'ve found all the items you requested. Here\'s your order summary:\n\n• Fresh Apples (2 kg) - $5.98\n• Fresh Milk (1 liter) - $2.49\n• Whole Wheat Bread (1 loaf) - $3.99\n• Potato Chips (1 bag) - $2.99\n\nSubtotal: $15.45\nTax: $1.60\nDelivery Fee: $2.99\nTotal: $20.04\n\nWould you like me to confirm this order?',
        type: 'BOT',
        metadata: {
          orderPreview: {
            items: [
              { name: 'Fresh Apples', quantity: 2, unitPrice: 2.99, total: 5.98 },
              { name: 'Fresh Milk', quantity: 1, unitPrice: 2.49, total: 2.49 },
              { name: 'Whole Wheat Bread', quantity: 1, unitPrice: 3.99, total: 3.99 },
              { name: 'Potato Chips', quantity: 1, unitPrice: 2.99, total: 2.99 },
            ],
            subtotal: 15.45,
            tax: 1.60,
            deliveryFee: 2.99,
            total: 20.04,
          },
        },
      },
    }),
    prisma.botMessage.create({
      data: {
        sessionId: botSession.id,
        content: 'Yes, please confirm the order.',
        type: 'USER',
      },
    }),
    prisma.botMessage.create({
      data: {
        sessionId: botSession.id,
        content: 'Perfect! Your order has been confirmed and is being prepared. Order number: ORD-2024-001. Estimated delivery time: 30-45 minutes. Thank you for using our service!',
        type: 'BOT',
        metadata: {
          orderConfirmed: true,
          orderNumber: 'ORD-2024-001',
          estimatedDelivery: '30-45 minutes',
        },
      },
    }),
  ]);

  console.log('🤖 Created bot session and messages');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Sample Data Summary:');
  console.log(`• Users: ${await prisma.user.count()}`);
  console.log(`• Store: ${await prisma.store.count()}`);
  console.log(`• Categories: ${await prisma.category.count()}`);
  console.log(`• Inventory Items: ${await prisma.inventoryItem.count()}`);
  console.log(`• Orders: ${await prisma.order.count()}`);
  console.log(`• Bot Sessions: ${await prisma.botSession.count()}`);
  console.log(`• Bot Messages: ${await prisma.botMessage.count()}`);

  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@quickcommerce.com / password123');
  console.log('Manager: manager@quickcommerce.com / password123');
  console.log('Agent: bot@quickcommerce.com / password123');
  console.log('Customer: customer@quickcommerce.com / password123');
  console.log('Delivery: delivery@quickcommerce.com / password123');

  console.log('\n🆔 Sample IDs for Testing:');
  console.log(`Store ID: ${store.id}`);
  console.log(`Bot Agent ID: ${botAgent.id}`);
  console.log(`Customer ID: ${customer.id}`);
  console.log(`Sample Order ID: ${order.id}`);
  console.log(`Bot Session ID: ${botSession.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 