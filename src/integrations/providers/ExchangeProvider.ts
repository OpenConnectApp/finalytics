import {
  Balance,
  Transaction,
  TransactionFilters,
  ExchangeInfo,
} from "../../types/exchange.js";

/**
 * Exchange Provider Interface
 *
 * All exchange integrations (CoinDCX, CoinSwitch, etc.) must implement this interface.
 * This ensures consistent API across all exchanges.
 *
 * @example
 * ```typescript
 * const provider = createExchangeProvider('coindcx', config);
 * const balances = await provider.getBalances();
 * const transactions = await provider.getTransactions({ limit: 10 });
 * ```
 */
export interface ExchangeProvider {
  /**
   * Test if the exchange connection is working
   * Validates API credentials
   *
   * @returns true if connection successful, false otherwise
   */
  testConnection(): Promise<boolean>;

  /**
   * Get all account balances
   * Returns normalized Balance objects
   *
   * @returns Array of balances for all currencies
   */
  getBalances(): Promise<Balance[]>;

  /**
   * Get transaction history
   *
   * @param filters - Optional filters for transactions
   * @returns Array of transactions matching the filters
   */
  getTransactions(filters?: TransactionFilters): Promise<Transaction[]>;

  /**
   * Get exchange information and metadata
   *
   * @returns Exchange identification and details
   */
  getExchangeInfo(): ExchangeInfo;
}
