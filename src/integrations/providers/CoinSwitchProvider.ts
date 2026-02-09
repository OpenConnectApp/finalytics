import type { CoinSwitchConfig, CoinSwitchPortfolioItem } from '../../types/coinswitch.js';
import type {
  Balance,
  ExchangeInfo,
  ExchangeProvider,
  Transaction,
  TransactionFilters,
} from '../../types/exchange.js';
import { TransactionType } from '../../types/exchange.js';
import {
  testConnection,
  getPortfolio,
  getOpenOrders,
  getClosedOrders,
} from '../coinswitch/api.js';

/**
 * Normalize CoinSwitch portfolio items to common Balance format
 */
function normalizeBalances(items: CoinSwitchPortfolioItem[]): Balance[] {
  return items.map((item) => {
    const available = parseFloat(item.main_balance);
    const locked = parseFloat(item.blocked_balance_order);

    return {
      currency: item.currency,
      available,
      locked,
      total: available + locked,
    };
  }).filter(balance => balance.total > 0); // Filter out zero balances
}

/**
 * CoinSwitch Exchange Provider
 *
 * Implements ExchangeProvider interface for CoinSwitch PRO API
 * Supports multiple exchanges: coinswitchx, wazirx, c2c1, c2c2
 */
export function createCoinSwitchProvider(
  config: CoinSwitchConfig
): ExchangeProvider {
  return {
    /**
     * Test connection to CoinSwitch API
     */
    async testConnection(): Promise<boolean> {
      return testConnection(config);
    },

    /**
     * Get normalized balances from portfolio
     */
    async getBalances(): Promise<Balance[]> {
      const portfolio = await getPortfolio(config);
      return normalizeBalances(portfolio.data);
    },

    /**
     * Get transaction history (orders)
     *
     * Maps CoinSwitch orders to common Transaction format
     * Includes both open and closed orders
     */
    async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
      const params: any = {
        count: 500, // Max allowed
      };

      // Apply filters
      if (filters?.startDate) {
        params.from_time = filters.startDate.getTime();
      }
      if (filters?.endDate) {
        params.to_time = filters.endDate.getTime();
      }
      if (filters?.currency) {
        params.symbols = `${filters.currency}/INR`;
      }

      // Get both open and closed orders
      const [openOrdersResponse, closedOrdersResponse] = await Promise.all([
        getOpenOrders(config, params),
        getClosedOrders(config, params),
      ]);

      const allOrders = [
        ...openOrdersResponse.data.orders,
        ...closedOrdersResponse.data.orders,
      ];

      // Convert to Transaction format
      const transactions: Transaction[] = allOrders.map((order) => {
        // Determine transaction type based on side and status
        let type: TransactionType;
        if (order.side.toLowerCase() === 'buy') {
          type = TransactionType.BUY;
        } else {
          type = TransactionType.SELL;
        }

        // Extract currency from symbol (e.g., "BTC/INR" -> "BTC")
        const [currency] = order.symbol.split('/');

        return {
          id: order.order_id,
          type,
          currency,
          amount: order.executed_qty > 0 ? order.executed_qty : order.orig_qty,
          timestamp: new Date(order.created_time),
          fee: undefined, // CoinSwitch doesn't provide fee in order response
          metadata: {
            symbol: order.symbol,
            price: order.price,
            averagePrice: order.average_price,
            status: order.status,
            exchange: order.exchange,
            orderSource: order.order_source,
            updatedAt: new Date(order.updated_time),
          },
        };
      });

      // Apply type filter if specified
      if (filters?.type) {
        return transactions.filter((tx) => tx.type === filters.type);
      }

      return transactions;
    },

    /**
     * Get exchange information
     */
    getExchangeInfo(): ExchangeInfo {
      return {
        id: 'coinswitch',
        name: 'CoinSwitch PRO',
        country: 'India',
        apiVersion: 'v2',
      };
    },
  };
}
