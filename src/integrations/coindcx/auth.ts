import crypto from "crypto";

/**
 * Generate HMAC-SHA256 signature for CoinDCX API authentication
 * @param payload - JSON stringified request body (no spaces)
 * @param secret - API secret key
 * @returns Hex signature
 */
export function generateSignature(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Create authentication headers for CoinDCX API requests
 * @param apiKey - API key
 * @param signature - HMAC-SHA256 signature
 * @returns Headers object
 */
export function createAuthHeaders(
  apiKey: string,
  signature: string,
): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-AUTH-APIKEY": apiKey,
    "X-AUTH-SIGNATURE": signature,
  };
}

/**
 * Create request payload with timestamp
 * @param body - Request body parameters
 * @returns JSON string with no spaces (required by CoinDCX)
 */
export function createPayload(body: Record<string, unknown> = {}): string {
  const requestBody = {
    ...body,
    timestamp: Math.floor(Date.now()),
  };

  // No spaces in JSON (required by CoinDCX API)
  return JSON.stringify(requestBody, null, 0);
}
