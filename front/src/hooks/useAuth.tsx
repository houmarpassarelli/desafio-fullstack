import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '../services/AuthService';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = new AuthService();

  const isAuthenticated = authService.isAuthenticated() && !!user;

  // Função para carregar dados do usuário
  const loadUser = async (): Promise<void> => {
    try {
      if (authService.hasValidAccessToken()) {
        const userData = await authService.me();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setUser(null);
      authService.clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  // Função de login
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Função de logout de todos os dispositivos
  const logoutAll = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logoutAll();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Função para atualizar dados do usuário
  const refreshUser = async (): Promise<void> => {
    if (authService.hasValidAccessToken()) {
      try {
        const userData = await authService.me();
        setUser(userData);
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
      }
    }
  };

  // Effect para carregar usuário na inicialização
  useEffect(() => {
    loadUser();
  }, []);

  // Effect para escutar eventos de expiração de token
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener('auth:expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    logoutAll,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}