import { useCallback } from 'react';
import { useAuth } from '@/store/contexts/AuthContext';
import { isAuthenticated } from '@/services/auth.service';

export const useRequireAuth = () => {
  const { showAuthDialog } = useAuth();

  const requireAuth = useCallback((callback: () => void) => {
    if (isAuthenticated()) {
      callback();
    } else {
      showAuthDialog('login');
    }
  }, [showAuthDialog]);

  return requireAuth;
}; 