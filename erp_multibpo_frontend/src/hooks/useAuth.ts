import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está logado ao carregar a página
    const checkAuthStatus = () => {
      if (typeof window !== 'undefined') {
        const loggedIn = localStorage.getItem('lucaIA_loggedIn') === 'true';
        setIsLoggedIn(loggedIn);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lucaIA_loggedIn', 'true');
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lucaIA_loggedIn');
      setIsLoggedIn(false);
    }
  };

  return {
    isLoggedIn,
    isLoading,
    login,
    logout
  };
}; 