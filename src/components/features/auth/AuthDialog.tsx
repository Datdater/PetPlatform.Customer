import React, { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

const AuthDialog: React.FC<AuthDialogProps> = ({ 
  isOpen, 
  onClose,
  initialView 
}) => {
  const [view, setView] = useState<'login' | 'register'>(initialView || 'login');

  useEffect(() => {
    if (initialView) {
      setView(initialView);
    }
  }, [initialView]);

  const handleSwitchToRegister = () => {
    setView('register');
  };

  const handleSwitchToLogin = () => {
    setView('login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {view === 'login' ? (
          <LoginForm 
            isOpen={isOpen} 
            onClose={onClose} 
            onRegisterClick={handleSwitchToRegister} 
          />
        ) : (
          <RegisterForm 
            isOpen={isOpen} 
            onClose={onClose} 
            onLoginClick={handleSwitchToLogin} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog; 