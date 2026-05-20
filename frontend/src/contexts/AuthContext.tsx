import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { authService } from '@/src/services/auth.service';
import { storageService } from '@/src/services/storage.service';
import type {
  UserProps,
  LoginCredentialsProps,
  RegisterCredentialsProps,
  AuthContextProps,
} from '@/src/types/auth.types';
import { router } from 'expo-router';
import { connectSocket, disconnectSocket } from '../socket/socket';

// Create context with default values
export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateAuth: async () => {},
  refreshUser: async () => {},
});

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Setup axios interceptor when token changes
  useEffect(() => {
    return authService.setupInterceptor(token);
  }, [token]);

  // Load authentication from storage
  const loadStoredAuth = async () => {
    try {
      const { token: storedToken, user: storedUser } = await storageService.getAuth();
      if (storedToken && storedUser) {
        if (authService.isTokenExpired(storedToken)) {
          await handleLogout();
        } else {
          setToken(storedToken);
          setUser(storedUser);

          // Connect socket after setting token
          try {
            console.log('🔌 Attempting to connect socket...');
            await connectSocket();
            console.log('✅ Socket connected successfully');
          } catch (socketError) {
            console.error('❌ Socket connection failed:', socketError);
            // Don't logout on socket error, user can still use the app
          }

          navigateToLogin();
        }
      }
    } catch (error) {
      console.error('Error loading auth:', error);
      await handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (credentials: LoginCredentialsProps) => {
    try {
      const { user: authUser, token: authToken } = await authService.login(credentials);

      await storageService.setAuth(authToken, authUser);
      setToken(authToken);
      setUser(authUser);

      // Connect socket after login
      try {
        console.log('🔌 Attempting to connect socket after login...');
        await connectSocket();
        console.log('✅ Socket connected successfully');
      } catch (socketError) {
        console.error('❌ Socket connection failed:', socketError);
        // Don't fail login on socket error
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw new Error('Network error. Please try again.');
    }
  };

  // Register handler
  const handleRegister = async (credentials: RegisterCredentialsProps) => {
    try {
      console.log('📝 Registering user:', { email: credentials.email, name: credentials.name });

      const { user: authUser, token: authToken } = await authService.register(credentials);

      console.log('✅ Registration successful:', { userId: authUser._id, email: authUser.email });

      await storageService.setAuth(authToken, authUser);
      setToken(authToken);
      setUser(authUser);

      // Connect socket after registration
      try {
        console.log('🔌 Attempting to connect socket after registration...');
        await connectSocket();
        console.log('✅ Socket connected successfully');
      } catch (socketError) {
        console.error('❌ Socket connection failed:', socketError);
        // Don't fail registration on socket error
      }
    } catch (error) {
      console.error('❌ Registration error:', error);

      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Request URL:', error.config?.url);
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw new Error('Network error. Please try again.');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await storageService.clearAuth();
    setToken(null);
    setUser(null);
    disconnectSocket();
  };

  const navigateToLogin = async ()=> {
      router.replace('/(main)/home')
  }

  // Update auth (for profile updates)
  const updateAuth = async (newToken: string, newUser: UserProps) => {
    await storageService.setAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      if (!token) return;

      const freshUser = await authService.getCurrentUser();
      await storageService.setAuth(token, freshUser);
      setUser(freshUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextProps = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateAuth,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook
export function useAuth() {
  return useContext(AuthContext);
}
