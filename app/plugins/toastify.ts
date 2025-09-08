/**
 * Nuxt plugin integrating Vue3Toastify for toast notifications.
 * Only shows toasts if user notifications are enabled in user store.
 *
 * @remarks
 * - Uses a Proxy to conditionally display toasts based on user preferences.
 * - Provides `toast` via Nuxt's inject/provide system.
 *
 * @param nuxtApp - The Nuxt application instance.
 * @returns An object providing the toast utility.
 */
import Vue3Toastify, { toast as originalToast } from 'vue3-toastify'
import { useUserStore } from '@/stores/userStore'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000,
    limit: 2,
    newestOnTop: true,
    position: 'top-center',
    transition: 'slide',
  })

  /**
   * Determines if toast notifications can be shown based on user preferences.
   * @returns {boolean} True if notifications are enabled, false otherwise.
   */
  const canShowToast = () => {
    const userStore = useUserStore()
    return userStore.parameters?.notificationsEnabled !== false
  }

  /**
   * Proxy for the toast function to conditionally display notifications.
   */
  const toast = new Proxy(originalToast, {
    apply(target, thisArg, args) {
      if (canShowToast()) return Reflect.apply(target, thisArg, args)
    },
    get(target, prop, receiver) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (target as any)[prop]
      if (typeof value === 'function') {
        return (...args: unknown[]) => (canShowToast() ? value(...args) : undefined)
      }
      return Reflect.get(target, prop, receiver)
    },
  })

  return {
    provide: { toast },
  }
})
