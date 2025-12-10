// Auth Service - Handle semua API calls untuk authentication
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

// Axios instance dengan config default
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor untuk attach token ke setiap request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== Helper Functions ====================

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    // Also set as cookie for middleware
    document.cookie = `auth_token=${token}; path=/; max-age=2592000`; // 30 days
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Remove cookies
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "user_data=; path=/; max-age=0";
  }
};

export const setUser = (user: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Also set as cookie for middleware
    document.cookie = `user_data=${encodeURIComponent(
      JSON.stringify(user)
    )}; path=/; max-age=2592000`; // 30 days
  }
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getUserRole = (): string | null => {
  const user = getUser();
  return user?.role || null;
};

export const getRedirectPath = (): string => {
  const role = getUserRole();

  // Redirect based on role
  if (role === "super_admin") {
    return "/super-admin/dashboard";
  } else if (role === "admin") {
    return "/admin/dashboard";
  } else {
    return "/dashboard";
  }
};

// ==================== Auth API Calls ====================

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  referral_code?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * Manual Login
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post("/login", credentials);
  const { token, user } = response.data;

  // Save token & user to localStorage
  setToken(token);
  setUser(user);

  return response.data;
};

/**
 * Manual Register
 */
export const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post("/register", credentials);
  const { token, user } = response.data;

  // Save token & user to localStorage
  setToken(token);
  setUser(user);

  return response.data;
};

/**
 * Google OAuth Login
 * @param credential - Credential JWT dari Google OAuth popup
 */
export const googleLogin = async (
  credential: string
): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/google/callback", {
    access_token: credential, // Backend expect 'access_token' key
  });
  const { token, user } = response.data.data || response.data;

  // Save token & user to localStorage
  setToken(token);
  setUser(user);

  return response.data;
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    removeToken();
  }
};

/**
 * Get Current User Profile (if needed)
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get("/user");
  return response.data;
};

// Export default object
const authService = {
  login,
  register,
  googleLogin,
  logout,
  getCurrentUser,
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  isAuthenticated,
  getUserRole,
  getRedirectPath,
};

export default authService;
