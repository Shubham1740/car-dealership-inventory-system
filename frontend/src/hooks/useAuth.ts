import { useState, useCallback, useMemo } from 'react';
import { decodeToken } from '../utils/decodeToken';

interface UseAuthResult {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuth = (): UseAuthResult => {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem('token')
  );

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setTokenState(null);
  }, []);

  const isAdmin = useMemo(() => {
    if (!token) return false;
    return decodeToken(token)?.role === 'admin';
  }, [token]);

  return {
    token,
    isAuthenticated: token !== null,
    isAdmin,
    setToken,
    logout,
  };
};