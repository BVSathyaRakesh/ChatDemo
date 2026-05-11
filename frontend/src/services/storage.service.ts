import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProps } from '@/src/types/auth.types';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export const storageService = {
  // Get stored auth data
  getAuth: async () => {
    try {
      // Check if AsyncStorage is available
      if (!AsyncStorage) {
        console.warn('AsyncStorage not available yet');
        return { token: null, user: null };
      }

      const [token, userJson] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      const user = userJson ? JSON.parse(userJson) : null;
      return { token, user };
    } catch (error) {
      console.error('Error getting auth from storage:', error);
      return { token: null, user: null };
    }
  },

  // Save auth data
  setAuth: async (token: string, user: UserProps) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, token),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
      ]);
    } catch (error) {
      console.error('Error saving auth to storage:', error);
      throw error;
    }
  },

  // Clear auth data
  clearAuth: async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing auth from storage:', error);
    }
  },
};
