import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: (token, user) => {
    localStorage.setItem('authToken', token);
    set({
      user: user || null,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },
  logout: () => {
    localStorage.removeItem('authToken');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    // Chuyển hướng về trang chủ sau khi đăng xuất
    window.location.href = '/';
  },
  updateUser: (user) => set((state) => ({ ...state, user })),
  initialize: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      try {
        // Decode JWT token để lấy user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.sub,
          email: payload.email,
          avatar: payload.avatar,
          name: payload.name // JWT payload vẫn là username nhưng map sang name
        };
        set({
          token,
          isAuthenticated: true,
          isLoading: false,
          user,
        });
      } catch (error) {
        // Nếu decode thất bại, vẫn set authenticated nhưng user = null
        set({
          token,
          isAuthenticated: true,
          isLoading: false,
          user: null,
        });
      }
    } else {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));