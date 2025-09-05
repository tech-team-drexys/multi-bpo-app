import { useState, useEffect } from 'react';
import { getUserProfile } from '@/services/api';

export interface UserData {
  id?: number;
  email?: string;
  fullName?: string;
  whatsapp?: string;
  is_active?: boolean;
  date_joined?: string;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado ao carregar a página
    console.log('isLoggedIn', isLoggedIn);
    
    const checkAuthStatus = async () => {
      if (typeof window !== 'undefined') {
        const loggedIn = localStorage.getItem('lucaIA_loggedIn') === 'true';
        const savedUser = localStorage.getItem('multibpo_user');
        const googleAuth = localStorage.getItem('lucaIA_googleAuth') === 'true';
        
        setIsLoggedIn(loggedIn);
        setIsGoogleAuth(googleAuth);
        
        if (loggedIn && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUserData(parsedUser);
          } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
          }
        }
        
        // Sempre buscar dados atualizados do perfil se estiver logado
        // if (loggedIn) {
          try {
            console.log('Verificando perfil do usuário...');
            const profileData = await getUserProfile();
            console.log('Perfil verificado:', profileData);
            setUserData(profileData);
          } catch (error) {
            console.error('Erro ao buscar perfil atualizado:', error);
            // Manter dados salvos se não conseguir buscar atualizados
            if (savedUser) {
              try {
                const parsedUser = JSON.parse(savedUser);
                setUserData(parsedUser);
              } catch (parseError) {
                console.error('Erro ao fazer parse dos dados salvos:', parseError);
              }
            }
          // }
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [isLoggedIn]);

  const login = async (isGoogleLogin = false) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lucaIA_loggedIn', 'true');
      if (isGoogleLogin) {
        localStorage.setItem('lucaIA_googleAuth', 'true');
        setIsGoogleAuth(true);
      }
      setIsLoggedIn(true);
      
      // Buscar dados do usuário após login
      const savedUser = localStorage.getItem('multibpo_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUserData(parsedUser);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      }
      
      // Sempre buscar dados atualizados do perfil após login
      try {
        console.log('Buscando perfil do usuário...');
        const profileData = await getUserProfile();
        console.log('Perfil carregado:', profileData);
        setUserData(profileData);
      } catch (error) {
        console.error('Erro ao buscar perfil atualizado:', error);
        // Manter dados salvos se não conseguir buscar atualizados
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUserData(parsedUser);
          } catch (parseError) {
            console.error('Erro ao fazer parse dos dados salvos:', parseError);
          }
        }
      }
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lucaIA_loggedIn');
      localStorage.removeItem('lucaIA_googleAuth');
      localStorage.removeItem('multibpo_tokens');
      localStorage.removeItem('multibpo_user');
      setIsLoggedIn(false);
      setIsGoogleAuth(false);
      setUserData(null);
    }
  };

  const refreshUserData = async () => {
    if (isLoggedIn) {
      try {
        const profileData = await getUserProfile();
        setUserData(profileData);
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
      }
    }
  };

  return {
    isLoggedIn,
    isLoading,
    userData,
    isGoogleAuth,
    login,
    logout,
    refreshUserData
  };
}; 