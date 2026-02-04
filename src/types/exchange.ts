/**
 * Common Exchange Types
 *
 * Normalized interfaces that work across all exchange integrations
 * (CoinDCX, CoinSwitch, etc.)
 */

/**
 * Normalized balance information
 * All exchanges must convert their balance format to this
 */
export interface Balance {
  currency: string; // e.g., "BTC", "USDT", "INR"
  available: number; // Available for trading/withdrawal
  locked: number; // Locked in open orders
  total: number; // available + locked
}

/**
 * Transaction types supported across exchanges
 */
export enum TransactionType {
  BUY = "buy",
  SELL = "sell",
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
}

/**
 * Normalized transaction information
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  currency: string;
  amount: number;
  timestamp: Date;
  fee?: number;
  status?: string;
  // Exchange-specific data can be stored here
  metadata?: Record<string, unknown>;
}

/**
 * Filters for fetching transactions
 */
export interface TransactionFilters {
  type?: TransactionType;
  currency?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

/**
 * Exchange identification and metadata
 */
export interface ExchangeInfo {
  id: string; // e.g., "coindcx", "coinswitch"
  name: string; // e.g., "CoinDCX", "CoinSwitch"
  country: string; // e.g., "India"
  apiVersion?: string; // API version if applicable
}

/**
 * Exchange configuration
 * Each exchange will extend this with their specific config
 */
export interface ExchangeConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
}
