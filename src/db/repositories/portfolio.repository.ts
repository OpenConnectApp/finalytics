import { prisma } from '../client.js';
import type { Portfolio, Prisma } from '@prisma/client';

/**
 * Portfolio Repository
 * Handles all portfolio-related database operations
 */

export class PortfolioRepository {
  /**
   * Create a new portfolio
   */
  async create(data: Prisma.PortfolioCreateInput): Promise<Portfolio> {
    return prisma.portfolio.create({ data });
  }

  /**
   * Find portfolio by ID
   */
  async findById(id: string): Promise<Portfolio | null> {
    return prisma.portfolio.findUnique({
      where: { id },
      include: {
        balances: true,
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Find all portfolios for a user
   */
  async findByUserId(userId: string): Promise<Portfolio[]> {
    return prisma.portfolio.findMany({
      where: { userId },
      include: {
        balances: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update portfolio
   */
  async update(id: string, data: Prisma.PortfolioUpdateInput): Promise<Portfolio> {
    return prisma.portfolio.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete portfolio (cascades to balances and transactions)
   */
  async delete(id: string): Promise<Portfolio> {
    return prisma.portfolio.delete({ where: { id } });
  }
}

export const portfolioRepository = new PortfolioRepository();
