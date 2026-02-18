import { encrypt, decrypt, encryptCredentials, decryptCredentials } from './encryption.js';

/**
 * Quick smoke test for encryption utilities
 * Run with: npx tsx src/utils/encryption.test.ts
 */

const SECRET = 'test-secret-key-that-is-long-enough-32chars';

console.log('Testing encryption utilities...\n');

// Test 1: Basic encrypt/decrypt
const plaintext = 'my-api-key-12345';
const encrypted = encrypt(plaintext, SECRET);
const decrypted = decrypt(encrypted, SECRET);

console.log('Test 1: Basic encrypt/decrypt');
console.log('  Original:', plaintext);
console.log('  Encrypted:', encrypted.substring(0, 32) + '...');
console.log('  Decrypted:', decrypted);
console.log('  Pass:', plaintext === decrypted ? '✅' : '❌');

// Test 2: Each encryption produces different output (random IV + salt)
const encrypted1 = encrypt(plaintext, SECRET);
const encrypted2 = encrypt(plaintext, SECRET);
console.log('\nTest 2: Random IV/salt (different output each time)');
console.log('  Different outputs:', encrypted1 !== encrypted2 ? '✅' : '❌');

// Test 3: Credential pair encryption
const credentials = {
  apiKey: 'coinswitch-api-key-abc123',
  apiSecret: 'coinswitch-secret-xyz789',
};
const encryptedCreds = encryptCredentials(credentials, SECRET);
const decryptedCreds = decryptCredentials(encryptedCreds, SECRET);

console.log('\nTest 3: Credential pair encryption');
console.log('  API Key Match:', credentials.apiKey === decryptedCreds.apiKey ? '✅' : '❌');
console.log(
  '  API Secret Match:',
  credentials.apiSecret === decryptedCreds.apiSecret ? '✅' : '❌'
);

// Test 4: Wrong secret fails
console.log('\nTest 4: Wrong secret fails');
try {
  decrypt(encrypted, 'wrong-secret-key-that-is-also-long-enough');
  console.log('  Should have failed: ❌');
} catch {
  console.log('  Correctly rejected wrong secret: ✅');
}

console.log('\nAll tests complete!');
