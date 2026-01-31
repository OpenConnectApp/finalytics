function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

import type { CoinDCXConfig } from "../types/coindcx.js";

const COINDCX_BASE_URL = "https://api.coindcx.com";

export function loadConfig() {
  return {
    coindcx: getCoinDCXConfig(),
  };
}

/**
 * Get CoinDCX-specific configuration
 * @returns CoinDCXConfig with API credentials and base URL
 */
export function getCoinDCXConfig(): CoinDCXConfig {
  return {
    apiKey: requireEnv("COINDCX_API_KEY"),
    apiSecret: requireEnv("COINDCX_API_SECRET"),
    baseUrl: COINDCX_BASE_URL,
  };
}

export type AppConfig = ReturnType<typeof loadConfig>;
