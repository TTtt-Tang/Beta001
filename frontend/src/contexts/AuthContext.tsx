import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/user';
import { userApi } from '../api/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => ({ success: false, message: '' }),
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const axios = (await import('axios')).default;
      const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
      const res = await axios.post(`${baseURL}/auth/login`, { username, password });
      const data = res.data;
      if (data.code === 200) {
        const userData = data.data;
        // 获取完整用户信息
        const fullUser = await userApi.getById(userData.id);
        setUser(fullUser);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(fullUser));
        return { success: true, message: '登录成功' };
      }
      return { success: false, message: data.message || '登录失败' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || '网络错误' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
