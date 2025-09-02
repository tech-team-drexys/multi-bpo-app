'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  registerUser, 
  loginWithCredentials, 
  loginSimple,
  logoutUser, 
  confirmEmail, 
  socialLogin,
  getUserProfile,
  updateUserProfile,
  checkAuthStatus,
  askLucaIA,
  getLucaStatus,
  RegisterUserData,
  LoginCredentials,
  SocialLoginData,
  UserProfile
} from '@/services/api';

// ===== INTERFACES E TYPES =====

interface User {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  whatsapp?: string;
  user_type: 'anonymous' | 'registered' | 'subscriber';
  registration_method?: 'email' | 'google' | 'facebook';
  email_confirmed: boolean;
  created_at?: string;
  luca_questions_remaining?: number | null;
  luca_questions_limit?: number | null;
  next_luca_reset?: string | null;
  allowed_erp_modules?: string[];
  blocked_erp_modules?: string[];
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  // Estados
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Funções de autenticação
  login: () => Promise<{ success: boolean }>; // Compatibilidade com Modal
  loginWithCredentials: (credentials: LoginCredentials) => Promise<any>;
  register: (userData: RegisterUserData) => Promise<any>;
  socialLogin: (data: SocialLoginData) => Promise<any>;
  confirmEmail: (token: string) => Promise<any>;
  logout: () => Promise<{ success: boolean }>;
  
  // Funções de perfil
  refreshProfile: () => Promise<void>;
  updateProfile: (data: UserProfile) => Promise<any>;
  
  // Funções utilitárias
  checkAuthStatus: () => void;
  refreshToken: () => Promise<boolean>;
  
  // Luca IA
  askLuca: (question: string, sessionId?: string) => Promise<any>;
  getLucaQuestionStatus: () => Promise<any>;
}

// ===== CONTEXT CREATION =====

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== PROVIDER COMPONENT =====

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estados
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ===== FUNÇÕES INTERNAS =====

  // Atualizar estado com dados do usuário e tokens
  const updateAuthState = (userData: User | null, tokensData: AuthTokens | null) => {
    setUser(userData);
    setTokens(tokensData);
    setIsAuthenticated(!!userData && !!tokensData);
  };

  // Limpar estado de autenticação
  const clearAuthState = () => {
    setUser(null);
    setTokens(null);
    setIsAuthenticated(false);
  };

  // ===== FUNÇÕES DE AUTENTICAÇÃO =====

  // Login simples (compatibilidade com Modal atual)
  const login = async (): Promise<{ success: boolean }> => {
    try {
      setIsLoading(true);
      const result = await loginSimple();
      
      // Simular usuário básico para compatibilidade
      const basicUser: User = {
        email: 'usuario@multibpo.com',
        user_type: 'registered',
        email_confirmed: true
      };
      
      setUser(basicUser);
      setIsAuthenticated(true);
      
      return result;
    } catch (error) {
      console.error('Erro no login simples:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Login com credenciais (integração real com backend)
  const loginWithCredentialsHandler = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await loginWithCredentials(credentials);
      
      if (response.access && response.refresh && response.user) {
        const tokensData: AuthTokens = {
          access: response.access,
          refresh: response.refresh
        };
        
        updateAuthState(response.user, tokensData);
        
        return response;
      } else {
        throw new Error('Dados de autenticação incompletos');
      }
    } catch (error) {
      console.error('Erro no login com credenciais:', error);
      clearAuthState();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Registro de usuário
  const register = async (userData: RegisterUserData) => {
    try {
      setIsLoading(true);
      const response = await registerUser(userData);
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login social
  const socialLoginHandler = async (data: SocialLoginData) => {
    try {
      setIsLoading(true);
      const response = await socialLogin(data);
      
      if (response.access && response.refresh && response.user) {
        const tokensData: AuthTokens = {
          access: response.access,
          refresh: response.refresh
        };
        
        updateAuthState(response.user, tokensData);
        
        return response;
      } else {
        throw new Error('Dados de login social incompletos');
      }
    } catch (error) {
      console.error('Erro no login social:', error);
      clearAuthState();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmação de email
  const confirmEmailHandler = async (token: string) => {
    try {
      setIsLoading(true);
      const response = await confirmEmail(token);
      
      // Atualizar usuário se logado
      if (user) {
        setUser(prev => prev ? { ...prev, email_confirmed: true } : null);
      }
      
      return response;
    } catch (error) {
      console.error('Erro na confirmação de email:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<{ success: boolean }> => {
    try {
      setIsLoading(true);
      const result = await logoutUser();
      clearAuthState();
      return result;
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // ===== FUNÇÕES DE PERFIL =====

  // Atualizar perfil do usuário
  const refreshProfile = async (): Promise<void> => {
    try {
      if (!tokens) return;
      
      const profileData = await getUserProfile();
      setUser(profileData);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      // Se token expirou, fazer logout
      if (error instanceof Error && error.message.includes('401')) {
        await logout();
      }
    }
  };

  // Atualizar dados do perfil
  const updateProfile = async (data: UserProfile) => {
    try {
      setIsLoading(true);
      const updatedUser = await updateUserProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ===== FUNÇÕES UTILITÁRIAS =====

  // Verificar status de autenticação
  const checkAuthStatusHandler = (): void => {
    try {
      const authStatus = checkAuthStatus();
      
      if (authStatus.isAuthenticated) {
        if (authStatus.user && authStatus.tokens) {
          // Autenticação completa (JWT)
          updateAuthState(authStatus.user, authStatus.tokens);
        } else {
          // Autenticação legada (localStorage simples)
          const basicUser: User = {
            email: 'usuario@multibpo.com',
            user_type: 'registered',
            email_confirmed: true
          };
          setUser(basicUser);
          setIsAuthenticated(true);
        }
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      clearAuthState();
    }
  };

  // Renovar token manualmente
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!tokens?.refresh) return false;
      
      // O refresh é feito automaticamente pelos interceptors
      // Esta função é para casos específicos
      await refreshProfile();
      return true;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      await logout();
      return false;
    }
  };

  // ===== FUNÇÕES LUCA IA =====

  // Fazer pergunta ao Luca IA
  const askLuca = async (question: string, sessionId?: string) => {
    try {
      const response = await askLucaIA(question, sessionId);
      
      // Atualizar contador de perguntas se retornado
      if (response.questions_remaining !== undefined && user) {
        setUser(prev => prev ? {
          ...prev,
          luca_questions_remaining: response.questions_remaining
        } : null);
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao fazer pergunta ao Luca IA:', error);
      throw error;
    }
  };

  // Status das perguntas do Luca IA
  const getLucaQuestionStatus = async () => {
    try {
      const status = await getLucaStatus();
      
      // Atualizar dados do usuário com status atual
      if (user && status.questions_remaining !== undefined) {
        setUser(prev => prev ? {
          ...prev,
          luca_questions_remaining: status.questions_remaining,
          next_luca_reset: status.next_reset
        } : null);
      }
      
      return status;
    } catch (error) {
      console.error('Erro ao buscar status do Luca IA:', error);
      throw error;
    }
  };

  // ===== EFFECTS =====

  // Verificar autenticação na inicialização
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        checkAuthStatusHandler();
        
        // Se tem tokens, tentar atualizar perfil
        const authStatus = checkAuthStatus();
        if (authStatus.isAuthenticated && authStatus.tokens) {
          try {
            await refreshProfile();
          } catch (error) {
            // Se falhar, manter dados básicos do localStorage
            console.warn('Não foi possível atualizar perfil, mantendo dados locais');
          }
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ===== CONTEXT VALUE =====

  const contextValue: AuthContextType = {
    // Estados
    user,
    tokens,
    isAuthenticated,
    isLoading,
    
    // Funções de autenticação
    login, // Compatibilidade com Modal
    loginWithCredentials: loginWithCredentialsHandler,
    register,
    socialLogin: socialLoginHandler,
    confirmEmail: confirmEmailHandler,
    logout,
    
    // Funções de perfil
    refreshProfile,
    updateProfile,
    
    // Funções utilitárias
    checkAuthStatus: checkAuthStatusHandler,
    refreshToken,
    
    // Luca IA
    askLuca,
    getLucaQuestionStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ===== HOOK PERSONALIZADO =====

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Export adicional para compatibilidade
export default AuthContext;