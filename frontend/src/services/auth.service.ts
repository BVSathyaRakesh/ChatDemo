import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '@/src/config/api.config';
import type {
  AuthResponseProps,
  LoginCredentialsProps,
  RegisterCredentialsProps,
  DecodedTokenProps,
} from '@/src/types/auth.types';

export const authService = {
  // Login API call
  login: async (credentials: LoginCredentialsProps) => {
    const response = await axios.post<AuthResponseProps>(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response.data.data;
  },

  // Register API call
  register: async (credentials: RegisterCredentialsProps) => {
    const response = await axios.post<AuthResponseProps>(
      `${API_BASE_URL}/auth/register`,
      credentials
    );
    return response.data.data;
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedTokenProps>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  // Setup axios interceptor for token
  setupInterceptor: (token: string | null) => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  },
};
