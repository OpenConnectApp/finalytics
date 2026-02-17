import { prisma } from '../client.js';
import type { Transaction, TransactionType, Prisma } from '@prisma/client';

/**
 * Transaction Repository
 * Handles transaction history
 */

export class TransactionRepository {
  /**
   * Create a new transaction
   */
  async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
    return prisma.transaction.create({ data });
  }

  /**
   * Upsert transaction (prevents duplicates from exchange)
   */
  async upsert(
    portfolioId: string,
    exchangeId: string,
    externalId: string,
    data: Prisma.TransactionCreateInput
  ): Promise<Transaction> {
    return prisma.transaction.upsert({
      where: {
        portfolioId_exchangeId_externalId: {
          portfolioId,
          exchangeId,
          externalId,
        },
      },
      create: data,
      update: {
        type: data.type,
        amount: data.amount,
        price: data.price,
        fee: data.fee,
        status: data.status,
        timestamp: data.timestamp,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Get transactions for a portfolio
   */
  async findByPortfolio(
    portfolioId: string,
    options?: {
      skip?: number;
      take?: number;
      type?: TransactionType;
      currency?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = { portfolioId };

    if (options?.type) where.type = options.type;
    if (options?.currency) where.currency = options.currency;
    if (options?.startDate || options?.endDate) {
      where.timestamp = {};
      if (options.startDate) where.timestamp.gte = options.startDate;
      if (options.endDate) where.timestamp.lte = options.endDate;
    }

    return prisma.transaction.findMany({
      where,
      skip: options?.skip || 0,
      take: options?.take || 50,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Get transaction count for a portfolio
   */
  async countByPortfolio(portfolioId: string): Promise<number> {
    return prisma.transaction.count({
      where: { portfolioId },
    });
  }
}

export const transactionRepository = new TransactionRepository();
