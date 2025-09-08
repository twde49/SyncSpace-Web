/**
 * Derives an AES-GCM CryptoKey from a master password using PBKDF2.
 * @param masterPassword - The master password to derive the key from.
 * @returns Promise resolving to a CryptoKey for encryption/decryption.
 */
export async function deriveKey(masterPassword: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(masterPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('syncspace_salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Hashes a password using PBKDF2 and returns a hex string.
 * @param password - The password to hash.
 * @returns Promise resolving to the hashed password as a hex string.
 */
export async function hashPasswordPBKDF2(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )

  const salt = encoder.encode('syncspace_salt')
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  )

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Encrypts data using AES-GCM and a provided CryptoKey.
 * @param data - The plaintext data to encrypt.
 * @param key - The CryptoKey to use for encryption.
 * @returns Promise resolving to an object containing base64 ciphertext and IV.
 */
export async function encryptData(
  data: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(data))

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  }
}

/**
 * Decrypts AES-GCM encrypted data using a provided CryptoKey and IV.
 * @param encryptedData - The base64 ciphertext to decrypt.
 * @param iv - The base64 initialization vector.
 * @param key - The CryptoKey to use for decryption.
 * @returns Promise resolving to the decrypted plaintext string, or null if failed.
 */
export async function decryptData(
  encryptedData: string,
  iv: string,
  key: CryptoKey
): Promise<string | null> {
  try {
    const decoder = new TextDecoder()
    const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))
    const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0))

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      key,
      encryptedBytes
    )

    return decoder.decode(decrypted)
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}
