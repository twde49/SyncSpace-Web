import { defineStore } from "pinia";
import useAuthFetch from "@/composables/useAuthFetch";
import { hashPasswordPBKDF2 } from "@/utils/cryptoUtils";

export const useMasterPasswordStore = defineStore("masterPassword", {
	state: () => ({
		encryptionKey: null as CryptoKey | null,
		isAuthenticated: false,
	}),

	actions: {
		async setMasterPassword(masterPassword: string) {
			await useAuthFetch(`passwords/set-master-password?${Date.now()}`, {
				method: "POST",
				body: JSON.stringify({ masterPassword }),
			});
		},

		async authenticate(masterPassword: string) {
			const res = await useAuthFetch(
				`passwords/get-master-password-hash?${Date.now()}`,
			);
			if (
				!res.data.value ||
				!res.data.value ||
				typeof res.data.value !== "object" ||
				!("hash" in res.data.value)
			) {
				return false;
			}

			const localHash = await hashPasswordPBKDF2(masterPassword);

			if (localHash === (res.data.value as { hash: string }).hash) {
				this.isAuthenticated = true;
				return true;
			}

			return false;
		},
	},
});
