import { prisma } from '../client.js';
import type { Balance, Prisma } from '@prisma/client';

/**
 * Balance Repository
 * Handles balance tracking and updates
 */

export class BalanceRepository {
  /**
   * Upsert balance (update if exists, create if not)
   */
  async upsert(
    portfolioId: string,
    exchangeId: string,
    currency: string,
    data: { available: number; locked: number; total: number }
  ): Promise<Balance> {
    return prisma.balance.upsert({
      where: {
        portfolioId_exchangeId_currency: {
          portfolioId,
          exchangeId,
          currency,
        },
      },
      create: {
        portfolioId,
        exchangeId,
        currency,
        ...data,
      },
      update: data,
    });
  }

  /**
   * Get balances for a portfolio
   */
  async findByPortfolio(portfolioId: string): Promise<Balance[]> {
    return prisma.balance.findMany({
      where: { portfolioId },
      orderBy: [{ exchangeId: 'asc' }, { currency: 'asc' }],
    });
  }

  /**
   * Get balances for a specific exchange in a portfolio
   */
  async findByPortfolioAndExchange(
    portfolioId: string,
    exchangeId: string
  ): Promise<Balance[]> {
    return prisma.balance.findMany({
      where: { portfolioId, exchangeId },
      orderBy: { currency: 'asc' },
    });
  }

  /**
   * Delete all balances for a portfolio
   */
  async deleteByPortfolio(portfolioId: string): Promise<number> {
    const result = await prisma.balance.deleteMany({
      where: { portfolioId },
    });
    return result.count;
  }
}

export const balanceRepository = new BalanceRepository();
