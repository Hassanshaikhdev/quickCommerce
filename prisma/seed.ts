import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@quickcommerce.com' },
    update: {},
    create: {
      email: 'admin@quickcommerce.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  // Create store manager
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@quickcommerce.com' },
    update: {},
    create: {
      email: 'manager@quickcommerce.com',
      name: 'Store Manager',
      password: managerPassword,
      role: 'STORE_MANAGER',
      isActive: true,
    },
  });

  // Create customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@quickcommerce.com' },
    update: {},
    create: {
      email: 'customer@quickcommerce.com',
      name: 'John Doe',
      password: customerPassword,
      role: 'CUSTOMER',
      isActive: true,
      phone: '+91-9876543210',
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
    },
  });

  // Create store
  const store = await prisma.store.upsert({
    where: { email: 'store@quickcommerce.com' },
    update: {},
    create: {
      name: 'QuickCommerce Store',
      description: 'Your one-stop shop for all grocery needs',
      address: '456 Shopping Center',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400002',
      phone: '+91-9876543211',
      email: 'store@quickcommerce.com',
      managerId: manager.id,
      isActive: true,
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'fruits-vegetables' },
      update: {},
      create: {
        name: 'Fruits & Vegetables',
        description: 'Fresh fruits and vegetables',
        slug: 'fruits-vegetables',
        storeId: store.id,
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'dairy-bakery' },
      update: {},
      create: {
        name: 'Dairy & Bakery',
        description: 'Fresh dairy products and bakery items',
        slug: 'dairy-bakery',
        storeId: store.id,
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'staples' },
      update: {},
      create: {
        name: 'Staples',
        description: 'Rice, wheat, pulses, and other staples',
        slug: 'staples',
        storeId: store.id,
        isActive: true,
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'beverages' },
      update: {},
      create: {
        name: 'Beverages',
        description: 'Soft drinks, juices, and other beverages',
        slug: 'beverages',
        storeId: store.id,
        isActive: true,
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'personal-care' },
      update: {},
      create: {
        name: 'Personal Care',
        description: 'Personal care and hygiene products',
        slug: 'personal-care',
        storeId: store.id,
        isActive: true,
        sortOrder: 5,
      },
    }),
  ]);

  // Create products
  const products = await Promise.all([
    // Fruits & Vegetables
    prisma.inventoryItem.upsert({
      where: { sku: 'BANANA-001' },
      update: {},
      create: {
        name: 'Fresh Bananas',
        description: 'Fresh yellow bananas, perfect for snacking',
        sku: 'BANANA-001',
        price: 60.00,
        costPrice: 45.00,
        stockQuantity: 100,
        unit: 'dozen',
        weight: 1200,
        images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'],
        brand: 'Organic',
        tags: ['organic', 'fresh', 'fruits'],
        categoryId: categories[0].id,
        storeId: store.id,
        isActive: true,
        isAvailable: true,
        isFeatured: true,
        rating: 4.5,
        reviewCount: 25,
      },
    }),
    prisma.inventoryItem.upsert({
      where: { sku: 'TOMATO-001' },
      update: {},
      create: {
        name: 'Fresh Tomatoes',
        description: 'Fresh red tomatoes, perfect for cooking',
        sku: 'TOMATO-001',
        price: 40.00,
        costPrice: 30.00,
        stockQuantity: 50,
        unit: 'kg',
        weight: 1000,
        images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'],
        brand: 'Fresh Farm',
        tags: ['fresh', 'vegetables'],
        categoryId: categories[0].id,
        storeId: store.id,
        isActive: true,
        isAvailable: true,
        rating: 4.2,
        reviewCount: 18,
      },
    }),

    // Dairy & Bakery
    prisma.inventoryItem.upsert({
      where: { sku: 'MILK-001' },
      update: {},
      create: {
        name: 'Amul Taaza Milk',
        description: 'Fresh full cream milk, 1 litre',
        sku: 'MILK-001',
        price: 58.00,
        costPrice: 45.00,
        stockQuantity: 200,
        unit: 'litre',
        weight: 1000,
        images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'],
        brand: 'Amul',
        tags: ['dairy', 'fresh', 'milk'],
        categoryId: categories[1].id,
        storeId: store.id,
        isActive: true,
        isAvailable: true,
        isFeatured: true,
        rating: 4.7,
        reviewCount: 45,
      },
    }),
    prisma.inventoryItem.upsert({
      where: { sku: 'BREAD-001' },
      update: {},
      create: {
        name: 'Britannia Brown Bread',
        description: 'Whole wheat brown bread, 400g',
        sku: 'BREAD-001',
        price: 35.00,
        costPrice: 25.00,
        stockQuantity: 75,
        unit: 'packet',
        weight: 400,
        images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'],
        brand: 'Britannia',
        tags: ['bakery', 'bread', 'whole wheat'],
        categoryId: categories[1].id,
        storeId: store.id,
        isActive: true,
        isAvailable: true,
        rating: 4.3,
        reviewCount: 32,
      },
    }),

    // Staples
    prisma.inventoryItem.upsert({
      where: { sku: 'RICE-001' },
      update: {},
      create: {
        name: 'India Gate Basmati Rice',
        description: 'Premium basmati rice, 2kg pack',
        sku: 'RICE-001',
        price: 180.00,
        costPrice: 140.00,
        stockQuantity: 60,
        unit: 'kg',
        weight: 2000,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
        brand: 'India Gate',
        tags: ['rice', 'basmati', 'premium'],
        categoryId: categories[2].id,
        storeId: store.id,
        isActive: true,
        isAvailable: true,
        isFeatured: true,
        rating: 4.6,
        reviewCount: 28,
      },
    }),
    prisma.inventoryItem.upsert({
      where: { sku: 'ATTA-001' },
      update: {},
      create: {
        name: 'Aashirvaad Atta',
        description: 'Whole wheat atta, 5kg pack',
        sku: 'ATTA-001',
        price: 220.00,
        costPrice: 180.00,
        stockQuantity: 40,
        unit: 'kg',
        weight: 5000,
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'],
        brand: 'Aashirvaad',
        tags: ['atta', 'wheat', 'whole wheat'],
        categoryId: categories[2].id,
        storeId: store.id,
        isActive: true,
        isAvailable: true,
        rating: 4.4,
        reviewCount: 22,
      },
    }),

    // Beverages
    prisma.inventoryItem.upsert({
      where: { sku: 'WATER-001' },
      update: {},
      create: {
        name: 'Bisleri Water',
        description: 'Pure drinking water, 1 litre bottle',
        sku: 'WATER-001',
        price: 20.00,
        costPrice: 12.00,
        stockQuantity: 300,
        unit: 'bottle',
        weight: 1000,
        images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'],
        brand: 'Bisleri',
        tags: ['water', 'drinking', 'pure'],
        categoryId: categories[3].id,
        storeId: store.id,
        isActive: true,
        isAvailable: true,
        rating: 4.1,
        reviewCount: 15,
      },
    }),

    // Personal Care
    prisma.inventoryItem.upsert({
      where: { sku: 'SOAP-001' },
      update: {},
      create: {
        name: 'Lux Soap',
        description: 'Luxury bathing soap, 75g',
        sku: 'SOAP-001',
        price: 25.00,
        costPrice: 18.00,
        stockQuantity: 150,
        unit: 'piece',
        weight: 75,
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
        brand: 'Lux',
        tags: ['soap', 'bathing', 'personal care'],
        categoryId: categories[4].id,
        storeId: store.id,
        isActive: true,
        isAvailable: true,
        rating: 4.0,
        reviewCount: 12,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`👥 Created ${await prisma.user.count()} users`);
  console.log(`🏪 Created ${await prisma.store.count()} stores`);
  console.log(`📂 Created ${await prisma.category.count()} categories`);
  console.log(`🛍️ Created ${await prisma.inventoryItem.count()} products`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 