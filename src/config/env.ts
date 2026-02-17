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

/**
 * Get encryption secret for API credentials
 * Used to encrypt/decrypt exchange API keys stored in database
 */
export function getEncryptionSecret(): string {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error(
      'Missing ENCRYPTION_SECRET environment variable. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  if (secret.length < 32) {
    throw new Error('ENCRYPTION_SECRET must be at least 32 characters long');
  }
  return secret;
}
