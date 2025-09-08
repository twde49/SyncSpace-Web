/**
 * Nuxt plugin providing a password generator utility.
 *
 * @example
 * const password = $passwordGenerator.generatePassword({
 *   length: 12,
 *   uppercase: true,
 *   lowercase: true,
 *   numbers: true,
 *   symbols: false
 * });
 *
 * @returns {Object} - Provides `generatePassword` function.
 */
export default defineNuxtPlugin(() => {
  return {
    provide: {
      /**
       * Generates a random password based on the provided options.
       * @param {Object} options - Password generation options.
       * @param {number} options.length - Length of the password.
       * @param {boolean} [options.uppercase] - Include uppercase letters.
       * @param {boolean} [options.lowercase] - Include lowercase letters.
       * @param {boolean} [options.numbers] - Include numbers.
       * @param {boolean} [options.symbols] - Include symbols.
       * @returns {string} - The generated password.
       * @throws {Error} If no character set is selected.
       */
      generatePassword: (options: {
        length: number
        uppercase?: boolean
        lowercase?: boolean
        numbers?: boolean
        symbols?: boolean
      }): string => {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const lower = 'abcdefghijklmnopqrstuvwxyz'
        const nums = '0123456789'
        const syms = '!@#$%^&*()_+[]{}|;:,.<>?'

        let characters = ''
        if (options.uppercase) characters += upper
        if (options.lowercase) characters += lower
        if (options.numbers) characters += nums
        if (options.symbols) characters += syms

        if (!characters) throw new Error('No character set selected.')

        let password = ''
        for (let i = 0; i < options.length; i++) {
          password += characters[Math.floor(Math.random() * characters.length)]
        }
        return password
      },
    },
  }
})
