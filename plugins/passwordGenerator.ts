export default defineNuxtPlugin(() => {
	return {
		provide: {
			generatePassword: (options: {
				length: number;
				uppercase?: boolean;
				lowercase?: boolean;
				numbers?: boolean;
				symbols?: boolean;
			}): string => {
				const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
				const lower = "abcdefghijklmnopqrstuvwxyz";
				const nums = "0123456789";
				const syms = "!@#$%^&*()_+[]{}|;:,.<>?";

				let characters = "";
				if (options.uppercase) characters += upper;
				if (options.lowercase) characters += lower;
				if (options.numbers) characters += nums;
				if (options.symbols) characters += syms;


				if (!characters) throw new Error("No character set selected.");

				let password = "";
				for (let i = 0; i < options.length; i++) {
					password += characters[Math.floor(Math.random() * characters.length)];
				}
				return password;
			},
		},
	};
});
