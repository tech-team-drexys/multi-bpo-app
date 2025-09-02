'use client';

import { useAuthContext } from '@/contexts/AuthContext';

// ===== INTERFACE PARA COMPATIBILIDADE =====

interface UseAuthReturn {
  // ===== COMPATIBILIDADE COM CÓDIGO EXISTENTE =====
  isLoggedIn: boolean;           // ← Sidebar.tsx, lucaIA/page.tsx
  isLoading: boolean;            // ← Estado de carregamento
  login: () => Promise<{ success: boolean }>;  // ← RegistrationModal.tsx
  logout: () => Promise<{ success: boolean }>; // ← Sidebar.tsx

  // ===== FUNCIONALIDADES EXPANDIDAS (NOVAS) =====
  // Estados completos
  user: any | null;              // Dados completos do usuário
  tokens: any | null;            // JWT tokens
  isAuthenticated: boolean;      // Status de autenticação (igual isLoggedIn)

  // Autenticação real
  loginWithCredentials: (credentials: { email: string; password: string }) => Promise<any>;
  register: (userData: any) => Promise<any>;
  socialLogin: (data: any) => Promise<any>;
  confirmEmail: (token: string) => Promise<any>;

  // Perfil do usuário
  refreshProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<any>;

  // Utilitários
  checkAuthStatus: () => void;
  refreshToken: () => Promise<boolean>;

  // Luca IA
  askLuca: (question: string, sessionId?: string) => Promise<any>;
  getLucaQuestionStatus: () => Promise<any>;
}

// ===== HOOK PRINCIPAL =====

export const useAuth = (): UseAuthReturn => {
  // Obter todas as funcionalidades do AuthContext
  const {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login,
    loginWithCredentials,
    register,
    socialLogin,
    confirmEmail,
    logout,
    refreshProfile,
    updateProfile,
    checkAuthStatus,
    refreshToken,
    askLuca,
    getLucaQuestionStatus
  } = useAuthContext();

  // ===== RETORNO COM COMPATIBILIDADE TOTAL =====
  return {
    // ===== INTERFACE ORIGINAL (COMPATIBILIDADE 100%) =====
    isLoggedIn: isAuthenticated,   // ✅ Sidebar.tsx: const { isLoggedIn } = useAuth()
    isLoading,                     // ✅ Estados de carregamento
    login,                         // ✅ RegistrationModal.tsx: const { login } = useAuth()
    logout,                        // ✅ Sidebar.tsx: logout function

    // ===== FUNCIONALIDADES EXPANDIDAS =====
    // Estados completos
    user,                          // Dados do usuário logado
    tokens,                        // JWT access + refresh tokens
    isAuthenticated,               // Mesmo que isLoggedIn (para clareza)

    // Autenticação avançada
    loginWithCredentials,          // Login real com email/senha
    register,                      // Registro de novo usuário
    socialLogin,                   // Login Google/Facebook
    confirmEmail,                  // Confirmação de email

    // Gerenciamento de perfil
    refreshProfile,                // Atualizar dados do perfil
    updateProfile,                 // Editar perfil do usuário

    // Funções utilitárias
    checkAuthStatus,               // Verificar status atual
    refreshToken,                  // Renovar token manualmente

    // Integração Luca IA
    askLuca,                       // Fazer pergunta à IA (substitui mock)
    getLucaQuestionStatus          // Status das perguntas restantes
  };
};

// ===== EXPORTS ADICIONAIS PARA FLEXIBILIDADE =====

// Re-export do contexto para uso direto quando necessário
export { useAuthContext } from '@/contexts/AuthContext';

// Hook simplificado apenas para status de login (performance)
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  return { isAuthenticated, isLoading, user };
};

// Hook específico para Luca IA
export const useLucaIA = () => {
  const { askLuca, getLucaQuestionStatus, user } = useAuthContext();
  
  return {
    askLuca,
    getLucaQuestionStatus,
    questionsRemaining: user?.luca_questions_remaining,
    questionsLimit: user?.luca_questions_limit,
    nextReset: user?.next_luca_reset
  };
};

// Hook para permissões ERP
export const useERPPermissions = () => {
  const { user, isAuthenticated } = useAuthContext();
  
  return {
    isAuthenticated,
    userType: user?.user_type || 'anonymous',
    allowedModules: user?.allowed_erp_modules || [],
    blockedModules: user?.blocked_erp_modules || [],
    canAccess: (module: string) => {
      if (!isAuthenticated) return false;
      return user?.allowed_erp_modules?.includes(module) || false;
    },
    isBlocked: (module: string) => {
      return user?.blocked_erp_modules?.includes(module) || false;
    }
  };
};

// ===== DEFAULT EXPORT =====
export default useAuth;