import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopstack.local' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@shopstack.local',
      passwordHash: adminPassword,
    },
  });

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Seeding admin user...');
  await prisma.user.create({
    data: {
      name: 'Master Admin',
      email: 'admin@shopstack.com',
      passwordHash: adminPassword,
      isAdmin: true,
    },
  });

  console.log('Seeding demo users...');
  const demoPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@shopstack.local' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@shopstack.local',
      passwordHash: demoPassword,
    },
  });

  console.log({ admin, demoUser });

  // Create Products
  const categories = ['Electronics', 'Accessories', 'Clothing', 'Books'];

  const productsData = [
    {
      name: 'Wireless Noise-Cancelling Headphones',
      slug: 'wireless-noise-cancelling-headphones',
      description: 'Experience pure sound with active noise cancellation.',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      stock: 50,
      category: 'Electronics',
    },
    {
      name: 'Minimalist Mechanical Keyboard',
      slug: 'minimalist-mechanical-keyboard',
      description: 'Sleek design with tactile switches for the ultimate typing experience.',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
      stock: 30,
      category: 'Electronics',
    },
    {
      name: 'Premium Leather Wallet',
      slug: 'premium-leather-wallet',
      description: 'Handcrafted genuine leather wallet with RFID protection.',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      stock: 100,
      category: 'Accessories',
    },
    {
      name: 'Classic Aviator Sunglasses',
      slug: 'classic-aviator-sunglasses',
      description: 'Timeless style with polarized lenses.',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      stock: 45,
      category: 'Accessories',
    },
    {
      name: 'Organic Cotton Classic Tee',
      slug: 'organic-cotton-classic-tee',
      description: 'Everyday comfort made from 100% organic cotton.',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      stock: 200,
      category: 'Clothing',
    },
    {
      name: 'Performance Running Shoes',
      slug: 'performance-running-shoes',
      description: 'Lightweight and responsive for your daily miles.',
      price: 159.99,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      stock: 75,
      category: 'Clothing',
    },
    {
      name: 'Full-Stack Web Development Handbook',
      slug: 'full-stack-web-development-handbook',
      description: 'The complete guide to modern web development.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
      stock: 120,
      category: 'Books',
    },
    {
      name: 'Design Systems by Example',
      slug: 'design-systems-by-example',
      description: 'Learn how to build scalable design systems.',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
      stock: 80,
      category: 'Books',
    },
  ];

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
