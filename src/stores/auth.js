import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    token: '',
    user: null,
  }),
  actions: {
    login(token, user) {
      this.isLoggedIn = true;
      this.token = token;
      this.user = user;
    },
    logout() {
      this.isLoggedIn = false;
      this.token = '';
      this.user = null;
    },
  },
});
