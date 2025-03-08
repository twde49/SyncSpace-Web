export default defineNuxtPlugin(() => {
  return {
    provide: {
      generatePassword: (options: {
        length: number,
        uppercase?: boolean,
        lowercase?: boolean,
        numbers?: boolean,
        symbols?: boolean,
        easyToRead?: boolean,
        easyToSay?: boolean
      }): string => {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const nums = '0123456789';
        const syms = '!@#$%^&*()_+[]{}|;:,.<>?';
        const readable = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
        const sayable = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let characters = '';
        if (options.easyToRead) {
          characters += readable;
        } else if (options.easyToSay) {
          characters += sayable;
        } else {
          if (options.uppercase) characters += upper;
          if (options.lowercase) characters += lower;
          if (options.numbers) characters += nums;
          if (options.symbols) characters += syms;
        }

        if (!characters) throw new Error('No character set selected.');

        let password = '';
        for (let i = 0; i < options.length; i++) {
          password += characters[Math.floor(Math.random() * characters.length)];
        }
        return password;
      }
    }
  };
});