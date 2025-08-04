import { useUserStore } from '@/stores/userStore';
import Vue3Toastify, { toast as originalToast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000,
    limit: 2,
    newestOnTop: true,
    position: 'top-center',
    transition: 'slide',
  });

  const canShowToast = () => {
    const userStore = useUserStore();
    return userStore.parameters?.notificationsEnabled !== false;
  };

  const toast = new Proxy(originalToast, {
    apply(target, thisArg, args) {
      if (canShowToast()) return Reflect.apply(target, thisArg, args);
    },
    get(target, prop, receiver) {
      if (typeof target[prop] === 'function') {
        return (...args: unknown[]) =>
          canShowToast() ? target[prop](...args) : undefined;
      }
      return Reflect.get(target, prop, receiver);
    },
  });

  return {
    provide: { toast },
  };
});
