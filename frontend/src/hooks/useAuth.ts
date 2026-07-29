import { useState, useCallback } from 'react';

interface UseAuthResult {
  token: string | null;
  isAuthenticated: boolean;
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

  return {
    token,
    isAuthenticated: token !== null,
    setToken,
    logout,
  };
};