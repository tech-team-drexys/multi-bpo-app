import { useState, useEffect } from 'react';
import { getUserProfile } from '@/services/api';

export interface UserData {
  success?: boolean;
  message?: string;
  user?: {
    id?: number;
    email?: string;
    full_name?: string;
    whatsapp?: string;
    email_confirmed?: boolean;
    created_at?: string;
    registration_method?: string;
    user_type?: string;
    luca_questions_limit?: number;
    luca_questions_remaining?: number;
    next_luca_reset?: string;
    allowed_erp_modules?: string[];
    blocked_erp_modules?: string[];
  };
}

const STORAGE_KEY = "userData";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (typeof window !== "undefined") {
        const loggedIn = localStorage.getItem("lucaIA_loggedIn") === "true";
        const googleAuth = localStorage.getItem("lucaIA_googleAuth") === "true";
        const savedUser = localStorage.getItem(STORAGE_KEY);

        setIsLoggedIn(loggedIn);
        setIsGoogleAuth(googleAuth);

        if (loggedIn) {
          if (savedUser) {
            try {
              setUserData(JSON.parse(savedUser));
            } catch (error) {
              console.error("Erro ao carregar dados do usuário:", error);
            }
          }

          try {
            const profileData = await getUserProfile();
            setUserData(profileData);
          } catch (error) {
            console.error("Erro ao buscar perfil atualizado:", error);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (isGoogleLogin = false) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lucaIA_loggedIn", "true");
      if (isGoogleLogin) {
        localStorage.setItem("lucaIA_googleAuth", "true");
        setIsGoogleAuth(true);
      }
      setIsLoggedIn(true);

      try {
        const profileData = await getUserProfile();
        setUserData(profileData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
      } catch (error) {
        console.error("Erro ao buscar perfil após login:", error);
      }
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lucaIA_loggedIn");
      localStorage.removeItem("lucaIA_googleAuth");
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("multibpo_tokens");
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
      } catch (error) {
        console.error("Erro ao atualizar dados do usuário:", error);
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
    refreshUserData,
  };
};
