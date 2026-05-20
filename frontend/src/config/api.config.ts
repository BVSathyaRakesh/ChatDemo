import { Platform } from 'react-native';

// API Configuration
// Automatically detects platform and uses correct host

// For physical device testing, replace with your computer's local IP:
// const DEV_HOST = '192.168.1.100'; // Find with: ipconfig (Windows) or ifconfig (Mac/Linux)

const getBaseURL = () => {
  if (!__DEV__) {
    // Production
    return 'https://your-production-api.com/api';
  }

  // Development - Auto-detect platform
   return 'https://chat-demo-git-main-bvrakesh540s-projects.vercel.app/api';
};

export const API_BASE_URL = getBaseURL();

// Log API URL for debugging
if (__DEV__) {
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('📱 Platform:', Platform.OS);
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  MESSAGES: {
    GET: '/messages',
    SEND: '/messages/send',
  },
  CONVERSATIONS: {
    GET: '/conversations',
    CREATE: '/conversations/create',
  },
};
