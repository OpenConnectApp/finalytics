import { exchangeRepository } from '../db/repositories/exchange.repository.js';
import { balanceRepository } from '../db/repositories/balance.repository.js';
import { transactionRepository } from '../db/repositories/transaction.repository.js';
import { encryptCredentials, decryptCredentials } from '../utils/encryption.js';
import { getEncryptionSecret } from '../config/env.js';
import { createCoinDCXProvider } from '../integrations/providers/CoinDCXProvider.js';
import { createCoinSwitchProvider } from '../integrations/providers/CoinSwitchProvider.js';
import type { ExchangeProvider } from '../integrations/providers/ExchangeProvider.js';
import type { ConnectedExchange, Prisma } from '@prisma/client';

/**
 * CoinDCX API base URL
 */
const COINDCX_BASE_URL = 'https://api.coindcx.com';

/**
 * Supported exchange IDs
 */
export type ExchangeId = 'coindcx' | 'coinswitch';

/**
 * Exchange connection input
 */
export interface ConnectExchangeInput {
  userId: string;
  exchangeId: ExchangeId;
  apiKey: string;
  apiSecret: string;
}

/**
 * Sync result
 */
export interface SyncResult {
  exchangeId: string;
  balancesSynced: number;
  transactionsSynced: number;
  success: boolean;
  error?: string;
}

/**
 * Exchange Service
 * Core business logic for managing exchange connections and data sync
 */
export class ExchangeService {
  /**
   * Map of exchange IDs to their display names
   */
  private readonly exchangeNames: Record<ExchangeId, string> = {
    coindcx: 'CoinDCX',
    coinswitch: 'CoinSwitch',
  };

  /**
   * Create an exchange provider from decrypted credentials
   */
  private createProvider(
    exchangeId: ExchangeId,
    apiKey: string,
    apiSecret: string
  ): ExchangeProvider {
    switch (exchangeId) {
      case 'coindcx':
        return createCoinDCXProvider({ apiKey, apiSecret, baseUrl: COINDCX_BASE_URL });
      case 'coinswitch':
        return createCoinSwitchProvider({ apiKey, apiSecret });
      default:
        throw new Error(`Unsupported exchange: ${exchangeId}`);
    }
  }

  /**
   * Connect a new exchange for a user
   * - Validates credentials with the exchange API
   * - Encrypts credentials before storing
   * - Returns the connected exchange record
   */
  async connectExchange(input: ConnectExchangeInput): Promise<ConnectedExchange> {
    const { userId, exchangeId, apiKey, apiSecret } = input;

    // Step 1: Validate credentials with exchange API
    const provider = this.createProvider(exchangeId, apiKey, apiSecret);
    const isValid = await provider.testConnection();
    if (!isValid) {
      throw new Error(`Invalid API credentials for ${this.exchangeNames[exchangeId]}`);
    }

    // Step 2: Encrypt credentials before storing
    const secret = getEncryptionSecret();
    const encrypted = encryptCredentials({ apiKey, apiSecret }, secret);

    // Step 3: Check if already connected - update if so
    const existing = await exchangeRepository.findByUserAndExchange(userId, exchangeId);
    if (existing) {
      return exchangeRepository.update(existing.id, {
        apiKey: encrypted.apiKey,
        apiSecret: encrypted.apiSecret,
        isActive: true,
      });
    }

    // Step 4: Store encrypted credentials in database
    return exchangeRepository.connect({
      exchangeId,
      exchangeName: this.exchangeNames[exchangeId],
      apiKey: encrypted.apiKey,
      apiSecret: encrypted.apiSecret,
      user: { connect: { id: userId } },
    });
  }

  /**
   * Disconnect an exchange for a user (soft delete)
   */
  async disconnectExchange(userId: string, exchangeId: ExchangeId): Promise<void> {
    const exchange = await exchangeRepository.findByUserAndExchange(userId, exchangeId);
    if (!exchange) {
      throw new Error(`Exchange ${exchangeId} not connected for this user`);
    }
    await exchangeRepository.disconnect(exchange.id);
  }

  /**
   * Get all connected exchanges for a user (without credentials)
   */
  async getConnectedExchanges(userId: string): Promise<Omit<ConnectedExchange, 'apiKey' | 'apiSecret'>[]> {
    const exchanges = await exchangeRepository.findByUserId(userId);
    // Strip sensitive fields before returning
    return exchanges.map(({ apiKey, apiSecret, ...safe }) => safe);
  }

  /**
   * Test connection for an existing connected exchange
   */
  async testConnection(userId: string, exchangeId: ExchangeId): Promise<boolean> {
    const exchange = await exchangeRepository.findByUserAndExchange(userId, exchangeId);
    if (!exchange || !exchange.isActive) {
      return false;
    }

    // Decrypt credentials
    const secret = getEncryptionSecret();
    const { apiKey, apiSecret } = decryptCredentials(
      { apiKey: exchange.apiKey, apiSecret: exchange.apiSecret },
      secret
    );

    // Test with provider
    const provider = this.createProvider(exchangeId, apiKey, apiSecret);
    return provider.testConnection();
  }

  /**
   * Sync balances for a user's exchange
   * Fetches live balances and upserts into database
   */
  async syncBalances(
    userId: string,
    portfolioId: string,
    exchangeId: ExchangeId
  ): Promise<number> {
    const exchange = await exchangeRepository.findByUserAndExchange(userId, exchangeId);
    if (!exchange || !exchange.isActive) {
      throw new Error(`Exchange ${exchangeId} not connected for this user`);
    }

    // Decrypt credentials
    const secret = getEncryptionSecret();
    const { apiKey, apiSecret } = decryptCredentials(
      { apiKey: exchange.apiKey, apiSecret: exchange.apiSecret },
      secret
    );

    // Fetch live balances from exchange
    const provider = this.createProvider(exchangeId, apiKey, apiSecret);
    const balances = await provider.getBalances();

    // Upsert each balance into database
    await Promise.all(
      balances.map((balance) =>
        balanceRepository.upsert(portfolioId, exchangeId, balance.currency, {
          available: balance.available,
          locked: balance.locked,
          total: balance.total,
        })
      )
    );

    // Update last synced timestamp
    await exchangeRepository.updateLastSynced(exchange.id);

    return balances.length;
  }

  /**
   * Sync transactions for a user's exchange
   * Fetches trade history and upserts into database
   */
  async syncTransactions(
    userId: string,
    portfolioId: string,
    exchangeId: ExchangeId,
    options?: { from?: Date; to?: Date }
  ): Promise<number> {
    const exchange = await exchangeRepository.findByUserAndExchange(userId, exchangeId);
    if (!exchange || !exchange.isActive) {
      throw new Error(`Exchange ${exchangeId} not connected for this user`);
    }

    // Decrypt credentials
    const secret = getEncryptionSecret();
    const { apiKey, apiSecret } = decryptCredentials(
      { apiKey: exchange.apiKey, apiSecret: exchange.apiSecret },
      secret
    );

    // Fetch transactions from exchange
    const provider = this.createProvider(exchangeId, apiKey, apiSecret);
    const transactions = await provider.getTransactions({
      startDate: options?.from,
      endDate: options?.to,
    });

    // Upsert each transaction into database
    let synced = 0;
    for (const tx of transactions) {
      if (!tx.id) continue;

      // Extract price from metadata if available (CoinSwitch stores it there)
      const price = tx.metadata?.price as number | undefined;

      await transactionRepository.upsert(
        portfolioId,
        exchangeId,
        tx.id,
        {
          portfolio: { connect: { id: portfolioId } },
          exchangeId,
          externalId: tx.id,
          type: tx.type.toUpperCase() as any,
          currency: tx.currency,
          amount: tx.amount,
          price: price ?? null,
          fee: tx.fee ?? null,
          status: tx.status ?? null,
          timestamp: tx.timestamp,
          metadata: tx.metadata as Prisma.InputJsonValue | undefined,
        }
      );
      synced++;
    }

    // Update last synced timestamp
    await exchangeRepository.updateLastSynced(exchange.id);

    return synced;
  }

  /**
   * Full sync - balances + transactions for all connected exchanges
   */
  async syncAll(userId: string, portfolioId: string): Promise<SyncResult[]> {
    const exchanges = await exchangeRepository.findByUserId(userId);
    const results: SyncResult[] = [];

    for (const exchange of exchanges) {
      const exchangeId = exchange.exchangeId as ExchangeId;
      try {
        const balancesSynced = await this.syncBalances(userId, portfolioId, exchangeId);
        const transactionsSynced = await this.syncTransactions(userId, portfolioId, exchangeId);
        results.push({
          exchangeId,
          balancesSynced,
          transactionsSynced,
          success: true,
        });
      } catch (error) {
        results.push({
          exchangeId,
          balancesSynced: 0,
          transactionsSynced: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }
}

export const exchangeService = new ExchangeService();
