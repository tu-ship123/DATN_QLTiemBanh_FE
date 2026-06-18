import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    accessToken: sessionStorage.getItem('accessToken') || null,
    refreshToken: sessionStorage.getItem('refreshToken') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setAuthData(authResponse) {
      this.accessToken = authResponse.accessToken;
      this.refreshToken = authResponse.refreshToken;
      
      sessionStorage.setItem('accessToken', authResponse.accessToken);
      sessionStorage.setItem('refreshToken', authResponse.refreshToken);
    },

    setUser(userData) {
      this.user = userData;
      sessionStorage.setItem('user', JSON.stringify(userData));
    },

    logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      sessionStorage.clear();
    }
  }
});