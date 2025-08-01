import axios, { AxiosInstance, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Tạo axios instance với cấu hình cơ bản
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header trước mỗi request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token) {
        // Nếu config.headers chưa có, khởi tạo đúng kiểu AxiosRequestHeaders
        if (!config.headers) {
          config.headers = {} as AxiosRequestHeaders;
        }
        // Gán token vào header Authorization
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) - token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      // Xóa token khỏi storage
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Redirect về trang login (nếu cần)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Hàm helper để set token
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Hàm helper để remove token
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
};

// Hàm helper để get token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

export default axiosInstance; 