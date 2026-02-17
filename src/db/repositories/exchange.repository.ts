import { prisma } from '../client.js';
import type { ConnectedExchange, Prisma } from '@prisma/client';

/**
 * Exchange Repository
 * Handles connected exchange credentials (encrypted)
 */

export class ExchangeRepository {
  /**
   * Connect a new exchange for user
   */
  async connect(data: Prisma.ConnectedExchangeCreateInput): Promise<ConnectedExchange> {
    return prisma.connectedExchange.create({ data });
  }

  /**
   * Find connected exchange by ID
   */
  async findById(id: string): Promise<ConnectedExchange | null> {
    return prisma.connectedExchange.findUnique({ where: { id } });
  }

  /**
   * Find all exchanges connected by a user
   */
  async findByUserId(userId: string): Promise<ConnectedExchange[]> {
    return prisma.connectedExchange.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find specific exchange for a user
   */
  async findByUserAndExchange(
    userId: string,
    exchangeId: string
  ): Promise<ConnectedExchange | null> {
    return prisma.connectedExchange.findUnique({
      where: {
        userId_exchangeId: { userId, exchangeId },
      },
    });
  }

  /**
   * Update exchange (e.g., credentials, last synced time)
   */
  async update(id: string, data: Prisma.ConnectedExchangeUpdateInput): Promise<ConnectedExchange> {
    return prisma.connectedExchange.update({
      where: { id },
      data,
    });
  }

  /**
   * Update last synced timestamp
   */
  async updateLastSynced(id: string): Promise<ConnectedExchange> {
    return prisma.connectedExchange.update({
      where: { id },
      data: { lastSyncedAt: new Date() },
    });
  }

  /**
   * Disconnect exchange (soft delete - set inactive)
   */
  async disconnect(id: string): Promise<ConnectedExchange> {
    return prisma.connectedExchange.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Permanently delete exchange
   */
  async delete(id: string): Promise<ConnectedExchange> {
    return prisma.connectedExchange.delete({ where: { id } });
  }
}

export const exchangeRepository = new ExchangeRepository();
