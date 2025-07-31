import axiosInstance, { setAuthToken, removeAuthToken } from './axios';

// Interface cho response API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Interface cho user
export interface User {
  id: string;
  email: string;
  name: string;
  // Thêm các field khác tùy theo backend
}

// Interface cho login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface cho login response
export interface LoginResponse {
  user: User;
  token: string;
}

// API Helper - Utility functions cho tất cả API calls
export const apiHelper = {
  // GET request
  get: async <T>(url: string, config?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.get(url, config);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Request failed'
      };
    }
  },

  // POST request
  post: async <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Request failed'
      };
    }
  },

  // PUT request
  put: async <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Request failed'
      };
    }
  },

  // PATCH request
  patch: async <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.patch(url, data, config);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Request failed'
      };
    }
  },

  // DELETE request
  delete: async <T>(url: string, config?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.delete(url, config);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Request failed'
      };
    }
  },

  // Upload file
  upload: async <T>(url: string, formData: FormData, config?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Upload failed'
      };
    }
  },

  // Download file
  download: async (url: string, filename?: string): Promise<ApiResponse<Blob>> => {
    try {
      const response = await axiosInstance.get(url, {
        responseType: 'blob'
      });
      
      // Tạo download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return {
        success: true,
        data: blob
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Download failed'
      };
    }
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      setAuthToken(token);
      
      return {
        success: true,
        data: { token, user }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Register
  register: async (userData: { email: string; password: string; name: string }): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      setAuthToken(token);
      
      return {
        success: true,
        data: { token, user }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    try {
      // Gọi API logout nếu backend có endpoint này
      await axiosInstance.post('/auth/logout');
    } catch (error) {
    } finally {
      removeAuthToken();
    }
    
    return { success: true };
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user info'
      };
    }
  }
};

// User API
export const userAPI = {
  // Update profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await axiosInstance.put('/users/profile', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user'
      };
    }
  }
};

export default {
  auth: authAPI,
  user: userAPI,
  helper: apiHelper
}; 