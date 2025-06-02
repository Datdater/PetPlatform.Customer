import React, { createContext, useContext, useState, ReactNode } from 'react';
import AuthDialog from '@/components/features/auth/AuthDialog';

interface AuthContextType {
  showAuthDialog: (view?: 'login' | 'register') => void;
  hideAuthDialog: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialView, setInitialView] = useState<'login' | 'register'>('login');

  const showAuthDialog = (view: 'login' | 'register' = 'login') => {
    setInitialView(view);
    setIsDialogOpen(true);
  };

  const hideAuthDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <AuthContext.Provider value={{ showAuthDialog, hideAuthDialog }}>
      {children}
      <AuthDialog
        isOpen={isDialogOpen}
        onClose={hideAuthDialog}
        initialView={initialView}
      />
    </AuthContext.Provider>
  );
}; 