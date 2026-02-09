import * as ed25519 from '@noble/ed25519';

/**
 * Generate Ed25519 signature for CoinSwitch API requests
 *
 * Signature Message Format:
 * - GET requests: METHOD + ENDPOINT + EPOCH_TIME
 * - POST/DELETE: METHOD + ENDPOINT + EPOCH_TIME + SORTED_JSON_BODY
 *
 * @param method HTTP method (GET, POST, DELETE)
 * @param endpoint API endpoint path
 * @param secretKey Hex-encoded Ed25519 private key
 * @param epochTime Current timestamp in milliseconds
 * @param body Optional request body (for POST/DELETE)
 * @returns Hex-encoded signature
 */
export async function generateSignature(
  method: string,
  endpoint: string,
  secretKey: string,
  epochTime: string,
  body?: Record<string, any>
): Promise<string> {
  // Construct signature message
  let signatureMessage = method + endpoint + epochTime;

  // For POST/DELETE with body, append sorted JSON
  if (body && Object.keys(body).length > 0) {
    const sortedBody = JSON.stringify(body, Object.keys(body).sort(), 0);
    signatureMessage += sortedBody;
  }

  // Convert secret key from hex to Uint8Array
  const secretKeyBytes = hexToBytes(secretKey);

  // Sign the message using Ed25519
  const messageBytes = new TextEncoder().encode(signatureMessage);
  const signatureBytes = await ed25519.sign(messageBytes, secretKeyBytes);

  // Return signature as hex string
  return bytesToHex(signatureBytes);
}

/**
 * Create authentication headers for CoinSwitch API
 */
export function createAuthHeaders(
  apiKey: string,
  signature: string,
  epochTime: string
): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-AUTH-APIKEY': apiKey,
    'X-AUTH-SIGNATURE': signature,
    'X-AUTH-EPOCH': epochTime,
  };
}

/**
 * Get current epoch time in milliseconds
 */
export function getCurrentEpochTime(): string {
  return Date.now().toString();
}

// Helper functions for hex <-> bytes conversion
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
