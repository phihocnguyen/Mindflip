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
      console.log("get", url, config);
      const response = await axiosInstance.get(url, config);
      // API trả về format: {"statusCode":200,"message":"Success","data":[]}
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Request failed'
        };
      }
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
      console.log("post", url, data, config);
      const response = await axiosInstance.post(url, data, config);
      // API trả về format: {"statusCode":200,"message":"Success","data":[]}
      const apiResponse = response.data;
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message 
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Request failed'
        };
      }
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
      // API trả về format: {"statusCode":200,"message":"Success","data":[]}
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Request failed'
        };
      }
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
      // API trả về format: {"statusCode":200,"message":"Success","data":[]}
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Request failed'
        };
      }
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
      // API trả về format: {"statusCode":200,"message":"Success","data":[]}
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Request failed'
        };
      }
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
      // API trả về format: {"statusCode":200,"message":"Success","data":[]}
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Upload failed'
        };
      }
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
      const response = await axiosInstance.post('/auth/', credentials);
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        const { token, user } = apiResponse.data;
        
        // Lưu token vào localStorage
        setAuthToken(token);
        
        return {
          success: true,
          data: { token, user },
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Login failed'
        };
      }
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
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        const { token, user } = apiResponse.data;
        
        // Lưu token vào localStorage
        setAuthToken(token);
        
        return {
          success: true,
          data: { token, user },
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Registration failed'
        };
      }
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
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Failed to get user info'
        };
      }
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
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Failed to update profile'
        };
      }
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
      const apiResponse = response.data;
      
      if (apiResponse.statusCode >= 200 && apiResponse.statusCode < 300) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message
        };
      } else {
        return {
          success: false,
          error: apiResponse.message || 'Failed to get user'
        };
      }
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