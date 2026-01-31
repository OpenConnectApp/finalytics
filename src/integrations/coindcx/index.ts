/**
 * CoinDCX Integration Module
 *
 * Provides functional API for interacting with CoinDCX exchange
 * Reference: https://docs.coindcx.com/
 *
 * @example
 * ```typescript
 * import { getBalances } from './integrations/coindcx';
 * import { getCoinDCXConfig } from './config';
 *
 * const config = getCoinDCXConfig();
 * const balances = await getBalances(config);
 * console.log(balances);
 * ```
 */

// Export all API methods
export { getBalances, testConnection } from "./api.js";

// Export authentication utilities (for advanced use)
export { generateSignature, createAuthHeaders, createPayload } from "./auth.js";

// Export HTTP client (for advanced use)
export { createHttpClient, makeAuthenticatedRequest } from "./http.js";

// Re-export types for convenience
export type {
  CoinDCXBalance,
  CoinDCXConfig,
  CoinDCXRequestBody,
} from "../../types/coindcx.js";
