import { CoinDCXConfig, CoinDCXBalance } from "../../types/coindcx.js";
import { makeAuthenticatedRequest } from "./http.js";

/**
 * Get user account balances from CoinDCX
 * Endpoint: POST /exchange/v1/users/balances
 * Reference: https://docs.coindcx.com/#get-balances
 *
 * @param config - CoinDCX configuration
 * @returns Array of currency balances with locked amounts
 */
export async function getBalances(
  config: CoinDCXConfig,
): Promise<CoinDCXBalance[]> {
  return makeAuthenticatedRequest<CoinDCXBalance[]>(
    config,
    "/exchange/v1/users/balances",
    {},
  );
}

/**
 * Test connection to CoinDCX API
 * Validates API credentials by attempting to fetch balances
 *
 * @param config - CoinDCX configuration
 * @returns true if connection successful, false otherwise
 */
export async function testConnection(config: CoinDCXConfig): Promise<boolean> {
  try {
    await getBalances(config);
    return true;
  } catch (error) {
    console.error("CoinDCX connection test failed:", error);
    return false;
  }
}
