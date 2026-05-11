// User Types
export interface UserProps {
  _id: string;
  email: string;
  name?: string;
  avatar?: string;
  created?: Date;
}

// API Response Types
export interface AuthResponseProps {
  success: boolean;
  message: string;
  data: {
    user: UserProps;
    token: string;
  };
}

export interface ErrorResponseProps {
  success: false;
  message: string;
  error?: string;
}

// Credentials Types
export interface LoginCredentialsProps {
  email: string;
  password: string;
}

export interface RegisterCredentialsProps {
  email: string;
  password: string;
  name?: string;
}

// JWT Token Types
export interface DecodedTokenProps {
  userId: string;
  iat: number;
  exp: number;
}

// Auth Context Types
export interface AuthContextProps {
  user: UserProps | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentialsProps) => Promise<void>;
  register: (credentials: RegisterCredentialsProps) => Promise<void>;
  logout: () => Promise<void>;
}
