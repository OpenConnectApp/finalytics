import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client singleton
 * Prevents multiple instances in development with hot reload
 */

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Disconnect from database (useful for graceful shutdown)
 */
export async function disconnect() {
  await prisma.$disconnect();
}

/**
 * Connect to database (useful for testing connections)
 */
export async function connect() {
  await prisma.$connect();
}
