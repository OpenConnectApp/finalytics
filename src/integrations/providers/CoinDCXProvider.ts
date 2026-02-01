import { ExchangeProvider } from "./ExchangeProvider.js";
import {
  Balance,
  Transaction,
  TransactionFilters,
  ExchangeInfo,
} from "../../types/exchange.js";
import { CoinDCXConfig, CoinDCXBalance } from "../../types/coindcx.js";
import { getBalances, testConnection } from "../coindcx/index.js";

/**
 * Convert CoinDCX balances to normalized Balance format
 */
function normalizeBalances(coindcxBalances: CoinDCXBalance[]): Balance[] {
  return coindcxBalances.map((b) => ({
    currency: b.currency,
    available: b.balance,
    locked: b.locked_balance,
    total: b.balance + b.locked_balance,
  }));
}

/**
 * Create CoinDCX Exchange Provider
 *
 * Factory function that returns an ExchangeProvider implementation for CoinDCX
 *
 * @param config - CoinDCX API configuration
 * @returns ExchangeProvider instance for CoinDCX
 *
 * @example
 * ```typescript
 * const provider = createCoinDCXProvider(config);
 * const balances = await provider.getBalances();
 * ```
 */
export function createCoinDCXProvider(config: CoinDCXConfig): ExchangeProvider {
  return {
    async testConnection(): Promise<boolean> {
      return testConnection(config);
    },

    async getBalances(): Promise<Balance[]> {
      const coindcxBalances = await getBalances(config);
      return normalizeBalances(coindcxBalances);
    },

    async getTransactions(_filters?: TransactionFilters): Promise<Transaction[]> {
      // Placeholder - will implement when we add CoinDCX transaction endpoints
      throw new Error("getTransactions not yet implemented for CoinDCX");
    },

    getExchangeInfo(): ExchangeInfo {
      return {
        id: "coindcx",
        name: "CoinDCX",
        country: "India",
        apiVersion: "v1",
      };
    },
  };
}
