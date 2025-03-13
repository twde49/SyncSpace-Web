import { defineStore } from 'pinia';
import Cookies from 'universal-cookie';

export const useUserStore = defineStore('user', {
  state: () => ({
    firstName: '',
    lastName: '',
    email: '',
    token: '',
    masterPasswordSet: false,
    socketId: '',
  }),
  actions: {
    setUser(data: {
      firstName: string;
      lastName: string;
      email: string;
      token: string;
      masterPasswordSet: boolean;
    }) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.token = data.token;
      this.masterPasswordSet = data.masterPasswordSet;

      const cookies = new Cookies();
      cookies.set('user', JSON.stringify(data), {
        path: '/',
        maxAge: 60 * 60 * 24 * 31,
        sameSite: 'strict',
        httpOnly: false,
      });
    },

    setSocketId(socketId: string) {
      this.socketId = socketId;
    },
    currentUser() {
      if (
        this.token === '' ||
        this.email === '' ||
        this.firstName === '' ||
        this.lastName === ''
      ) {
        return null;
      }
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        token: this.token,
        masterPasswordSet: this.masterPasswordSet,
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
          this.masterPasswordSet = userData.masterPasswordSet;
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
      this.masterPasswordSet = false;

      const cookies = new Cookies();
      cookies.remove('user', { path: '/' });
    },
  },
});
