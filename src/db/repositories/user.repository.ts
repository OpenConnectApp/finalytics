import { prisma } from '../client.js';
import type { User, Prisma } from '@prisma/client';

/**
 * User Repository
 * Handles all user-related database operations
 */

export class UserRepository {
  /**
   * Create a new user
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Update user
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user (cascades to portfolios and exchanges)
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  /**
   * List all users with pagination
   */
  async list(skip = 0, take = 10): Promise<User[]> {
    return prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const userRepository = new UserRepository();
