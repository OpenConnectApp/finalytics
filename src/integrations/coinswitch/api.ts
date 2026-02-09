import type {
  CoinSwitchConfig,
  CoinSwitchPortfolioResponse,
  CoinSwitchOrdersResponse,
  CoinSwitchServerTimeResponse,
} from '../../types/coinswitch.js';
import { createHttpClient, makeAuthenticatedRequest } from './http.js';

/**
 * Test CoinSwitch API connection by validating keys
 */
export async function testConnection(config: CoinSwitchConfig): Promise<boolean> {
  try {
    const client = createHttpClient(config);
    await makeAuthenticatedRequest(
      client,
      'GET',
      '/trade/api/v2/validate/keys'
    );
    return true;
  } catch (error) {
    console.error('CoinSwitch connection test failed:', error);
    return false;
  }
}

/**
 * Get server time from CoinSwitch
 */
export async function getServerTime(
  config: CoinSwitchConfig
): Promise<number> {
  const client = createHttpClient(config);
  const response = await makeAuthenticatedRequest<CoinSwitchServerTimeResponse>(
    client,
    'GET',
    '/trade/api/v2/time'
  );
  return response.serverTime;
}

/**
 * Get user portfolio (balances)
 */
export async function getPortfolio(
  config: CoinSwitchConfig
): Promise<CoinSwitchPortfolioResponse> {
  const client = createHttpClient(config);
  return makeAuthenticatedRequest<CoinSwitchPortfolioResponse>(
    client,
    'GET',
    '/trade/api/v2/user/portfolio'
  );
}

/**
 * Get open orders
 */
export async function getOpenOrders(
  config: CoinSwitchConfig,
  params?: {
    count?: number;
    from_time?: number;
    to_time?: number;
    side?: 'buy' | 'sell';
    symbols?: string;
    exchanges?: string;
    type?: 'limit';
  }
): Promise<CoinSwitchOrdersResponse> {
  const client = createHttpClient(config);
  return makeAuthenticatedRequest<CoinSwitchOrdersResponse>(
    client,
    'GET',
    '/trade/api/v2/orders',
    undefined,
    { ...params, open: true }
  );
}

/**
 * Get closed orders
 */
export async function getClosedOrders(
  config: CoinSwitchConfig,
  params?: {
    count?: number;
    from_time?: number;
    to_time?: number;
    side?: 'buy' | 'sell';
    symbols?: string;
    exchanges?: string;
    type?: 'limit';
    status?: string;
  }
): Promise<CoinSwitchOrdersResponse> {
  const client = createHttpClient(config);
  return makeAuthenticatedRequest<CoinSwitchOrdersResponse>(
    client,
    'GET',
    '/trade/api/v2/orders',
    undefined,
    { ...params, open: false }
  );
}
