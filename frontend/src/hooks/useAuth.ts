import { useState, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface UseAuthReturn {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.login(email, password);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData: Partial<User>, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await authService.signup(userData, password);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to signup');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return { user, login, signup, logout, error, loading };
};