'use client';
import { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
