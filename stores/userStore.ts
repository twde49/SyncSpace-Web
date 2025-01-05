import { defineStore } from 'pinia';
import Cookies from 'universal-cookie';

export const useUserStore = defineStore('user', {
  state: () => ({
    firstName: '',
    lastName: '',
    email: '',
    token: '',
  }),
  actions: {
    setUser(data: { firstName: string; lastName: string; email: string; token: string }) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.token = data.token;

      const cookies = new Cookies();
      cookies.set('user', JSON.stringify(data), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        httpOnly: false,
      });
    },
    currentUser() {
      if (this.token === '' || this.email === '' || this.firstName === '' || this.lastName === '') {
        return null;
      }
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        token: this.token,
      };
    },
    loadUserFromCookies() {
      const cookies = new Cookies();
      const userData = cookies.get('user');

      if (userData) {
        try {
          this.firstName = userData.firstName;
          this.lastName = userData.lastName;
          this.email = userData.email;
          this.token = userData.token;
        } catch (e) {
          console.error('Failed to parse user data from cookies:', e);
        }
      }
    },
    logout() {
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.token = '';

      const cookies = new Cookies();
      cookies.remove('user', { path: '/' });
    },
  },
});
