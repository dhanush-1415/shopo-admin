/**
 * Authentication Store using Zustand
 * Manages authentication state, token, and user data
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const AUTH_STORAGE_KEY = 'rabbit-finch-auth';

/**
 * Auth Store
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      accessToken: null,
      user: null,

      // Actions
      /**
       * Set authentication data after successful login
       */
      setAuth: (accessToken, user) => {
        set({
          accessToken,
          user,
        });
      },

      /**
       * Clear authentication data on logout
       */
      logout: () => {
        set({
          accessToken: null,
          user: null,
        });
      },

      /**
       * Check if user is authenticated (function version)
       */
      checkAuth: () => {
        return !!get().accessToken;
      },

      /**
       * Get access token
       */
      getToken: () => {
        return get().accessToken;
      },

      /**
       * Get user data
       */
      getUser: () => {
        return get().user;
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      // Only persist token and user
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);

