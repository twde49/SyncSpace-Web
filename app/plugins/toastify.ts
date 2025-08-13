import Vue3Toastify, { toast as originalToast } from "vue3-toastify";
import { useUserStore } from "@/stores/userStore";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(Vue3Toastify, {
		autoClose: 3000,
		limit: 2,
		newestOnTop: true,
		position: "top-center",
		transition: "slide",
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const value = (target as any)[prop];
			if (typeof value === "function") {
				return (...args: unknown[]) =>
					canShowToast() ? value(...args) : undefined;
			}
			return Reflect.get(target, prop, receiver);
		},
	});

	return {
		provide: { toast },
	};
});
