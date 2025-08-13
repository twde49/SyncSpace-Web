import { ref } from "vue";
import useAuthFetch from "~/composables/useAuthFetch";
import type { PasswordItem } from "~/types/PasswordItem";

const passwords = ref<PasswordItem[]>([]);
const masterKey = ref<CryptoKey | null>(null);

async function deriveKey(masterPassword: string): Promise<CryptoKey> {
	const encoder = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(masterPassword),
		{ name: "PBKDF2" },
		false,
		["deriveBits", "deriveKey"],
	);

	return await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: encoder.encode("syncspace_salt"),
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		true,
		["encrypt", "decrypt"],
	);
}

async function encryptPassword(
	password: string,
): Promise<{ iv: string; data: string }> {
	if (!masterKey.value) throw new Error("Master key not set!");

	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encodedPassword = new TextEncoder().encode(password);

	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		masterKey.value,
		encodedPassword,
	);

	return {
		iv: btoa(String.fromCharCode(...iv)),
		data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
	};
}

async function decryptPassword(
	encryptedData: string,
	iv: string,
): Promise<string> {
	if (!masterKey.value) throw new Error("Master key not set!");

	const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
	const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) =>
		c.charCodeAt(0),
	);

	const decrypted = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv: ivBytes },
		masterKey.value,
		encryptedBytes,
	);

	return new TextDecoder().decode(decrypted);
}

async function fetchPasswords() {
	const res = await useAuthFetch(`passwords/list?${Date.now()}`);
	passwords.value = res.data.value as PasswordItem[];
}

async function storePassword(passwordData: PasswordItem) {
	if (!passwordData.password) throw new Error("Mot de passe requis");
	const encrypted = await encryptPassword(passwordData.password);

	await useAuthFetch(`passwords/add?${Date.now()}`, {
		method: "POST",
		body: JSON.stringify({
			url: passwordData.url,
			name: passwordData.name,
			email: passwordData.email,
			password: encrypted.data,
			iv: encrypted.iv,
		}),
	});

	fetchPasswords();
}

export function usePasswordManager() {
	return {
		passwords,
		fetchPasswords,
		storePassword,
		encryptPassword,
		decryptPassword,
		deriveKey,
		masterKey,
	};
}
