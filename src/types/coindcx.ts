/**
 * CoinDCX API Type Definitions
 * Reference: https://docs.coindcx.com/
 */

/**
 * User balance information from CoinDCX
 */
export interface CoinDCXBalance {
  currency: string;
  balance: number;
  locked_balance: number;
}

/**
 * Configuration for CoinDCX API client
 */
export interface CoinDCXConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
}

/**
 * Base structure for CoinDCX API request body
 */
export interface CoinDCXRequestBody {
  timestamp: number;
  [key: string]: any;
}

/**
 * Generic API response wrapper
 */
export interface CoinDCXResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}
