import { defineStore } from 'pinia'
import useAuthFetch from '@/composables/useAuthFetch'
import { hashPasswordPBKDF2 } from '@/utils/cryptoUtils'

/**
 * Pinia store for managing master password authentication and encryption key.
 * Provides actions to set and authenticate the master password.
 */

export const useMasterPasswordStore = defineStore('masterPassword', {
  state: () => ({
    /**
     * The derived encryption key from the master password.
     */
    encryptionKey: null as CryptoKey | null,
    /**
     * Indicates if the user is authenticated with the master password.
     */
    isAuthenticated: false,
  }),

  actions: {
    /**
     * Sets the master password on the server.
     * @param masterPassword - The master password to set.
     */
    async setMasterPassword(masterPassword: string) {
      await useAuthFetch(`passwords/set-master-password?${Date.now()}`, {
        method: 'POST',
        body: JSON.stringify({ masterPassword }),
      })
    },

    /**
     * Authenticates the user by comparing the local hash with the server hash.
     * @param masterPassword - The master password to authenticate.
     * @returns Promise resolving to true if authenticated, false otherwise.
     */
    async authenticate(masterPassword: string) {
      const res = await useAuthFetch(`passwords/get-master-password-hash?${Date.now()}`)
      if (
        !res.data.value ||
        !res.data.value ||
        typeof res.data.value !== 'object' ||
        !('hash' in res.data.value)
      ) {
        return false
      }

      const localHash = await hashPasswordPBKDF2(masterPassword)

      if (localHash === (res.data.value as { hash: string }).hash) {
        this.isAuthenticated = true
        return true
      }

      return false
    },
  },
})
