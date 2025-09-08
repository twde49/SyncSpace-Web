/**
 * Composable for managing password encryption, decryption, and storage.
 * Uses AES-GCM and PBKDF2 for secure password handling.
 * @module usePassword
 */

import { ref } from 'vue'
import useAuthFetch from '~/composables/useAuthFetch'
import type { PasswordItem } from '~/types/PasswordItem'

const passwords = ref<PasswordItem[]>([])
const masterKey = ref<CryptoKey | null>(null)

/**
 * Derives an AES-GCM CryptoKey from a master password using PBKDF2.
 * @param masterPassword - The master password to derive the key from.
 * @returns Promise resolving to a CryptoKey for encryption/decryption.
 */

async function deriveKey(masterPassword: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(masterPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
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
    true,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypts a password using AES-GCM and the master key.
 * @param password - The plaintext password to encrypt.
 * @returns Promise resolving to an object containing base64 IV and encrypted data.
 */
async function encryptPassword(password: string): Promise<{ iv: string; data: string }> {
  if (!masterKey.value) throw new Error('Master key not set!')

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encodedPassword = new TextEncoder().encode(password)

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    masterKey.value,
    encodedPassword
  )

  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
  }
}

/**
 * Decrypts AES-GCM encrypted password data using the master key.
 * @param encryptedData - The base64 encrypted password.
 * @param iv - The base64 initialization vector.
 * @returns Promise resolving to the decrypted plaintext password.
 */
async function decryptPassword(encryptedData: string, iv: string): Promise<string> {
  if (!masterKey.value) throw new Error('Master key not set!')

  const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0))
  const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    masterKey.value,
    encryptedBytes
  )

  return new TextDecoder().decode(decrypted)
}

/**
 * Fetches the list of password items from the server and updates the local state.
 */
async function fetchPasswords() {
  const res = await useAuthFetch(`passwords/list?${Date.now()}`)
  passwords.value = res.data.value as PasswordItem[]
}

/**
 * Stores a password item on the server after encrypting the password.
 * @param passwordData - The password item to store.
 */
async function storePassword(passwordData: PasswordItem) {
  if (!passwordData.password) throw new Error('Mot de passe requis')
  const encrypted = await encryptPassword(passwordData.password)

  await useAuthFetch(`passwords/add?${Date.now()}`, {
    method: 'POST',
    body: JSON.stringify({
      url: passwordData.url,
      name: passwordData.name,
      email: passwordData.email,
      password: encrypted.data,
      iv: encrypted.iv,
    }),
  })

  fetchPasswords()
}

/**
 * Main interface for the password manager composable.
 * @returns Object containing password state and utility functions.
 */
export function usePasswordManager() {
  return {
    passwords,
    fetchPasswords,
    storePassword,
    encryptPassword,
    decryptPassword,
    deriveKey,
    masterKey,
  }
}
