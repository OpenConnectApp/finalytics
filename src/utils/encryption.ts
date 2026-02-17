import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

/**
 * Encryption utility for securing API credentials
 * Uses AES-256-GCM - authenticated encryption (prevents tampering)
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;       // Initialization vector length
const AUTH_TAG_LENGTH = 16; // GCM authentication tag length
const SALT_LENGTH = 32;     // Salt for key derivation
const KEY_LENGTH = 32;      // AES-256 requires 32 byte key

/**
 * Derive encryption key from master secret using scrypt
 * Ensures consistent key length regardless of secret length
 */
function deriveKey(secret: string, salt: Buffer): Buffer {
  return scryptSync(secret, salt, KEY_LENGTH);
}

/**
 * Encrypt a plaintext string
 * Format: salt(32):iv(16):authTag(16):encryptedData (all hex encoded)
 *
 * @param plaintext - Text to encrypt
 * @param secret - Master encryption secret from environment
 * @returns Encrypted string in hex format
 */
export function encrypt(plaintext: string, secret: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(secret, salt);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Combine all parts: salt + iv + authTag + encrypted
  return Buffer.concat([salt, iv, authTag, encrypted]).toString('hex');
}

/**
 * Decrypt an encrypted string
 *
 * @param encryptedHex - Encrypted string in hex format
 * @param secret - Master encryption secret from environment
 * @returns Decrypted plaintext string
 */
export function decrypt(encryptedHex: string, secret: string): string {
  const buffer = Buffer.from(encryptedHex, 'hex');

  // Extract each part from the combined buffer
  const salt = buffer.subarray(0, SALT_LENGTH);
  const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = buffer.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
  );
  const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

  const key = deriveKey(secret, salt);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString('utf8');
}

/**
 * Encrypt API credentials object
 *
 * @param credentials - API key and secret to encrypt
 * @param secret - Master encryption secret
 */
export function encryptCredentials(
  credentials: { apiKey: string; apiSecret: string },
  secret: string
): { apiKey: string; apiSecret: string } {
  return {
    apiKey: encrypt(credentials.apiKey, secret),
    apiSecret: encrypt(credentials.apiSecret, secret),
  };
}

/**
 * Decrypt API credentials object
 *
 * @param encrypted - Encrypted API key and secret
 * @param secret - Master encryption secret
 */
export function decryptCredentials(
  encrypted: { apiKey: string; apiSecret: string },
  secret: string
): { apiKey: string; apiSecret: string } {
  return {
    apiKey: decrypt(encrypted.apiKey, secret),
    apiSecret: decrypt(encrypted.apiSecret, secret),
  };
}
