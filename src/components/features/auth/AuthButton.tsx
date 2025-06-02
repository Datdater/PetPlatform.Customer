import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import AuthDialog from './AuthDialog';
import { isAuthenticated, logout } from '@/services/auth.service';

const AuthButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialView, setInitialView] = useState<'login' | 'register'>('login');

  // Check if user is logged in on component mount
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleOpenLogin = () => {
    setInitialView('login');
    setIsDialogOpen(true);
  };

  const handleOpenRegister = () => {
    setInitialView('register');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => window.location.href = '/user/profile'}>
          <UserCircle className="h-5 w-5" />
          <span className="font-medium">Tài khoản</span>
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={handleOpenLogin}
        >
          <UserCircle className="h-5 w-5" />
          <span className="font-medium">Đăng nhập</span>
        </Button>
        <Button onClick={handleOpenRegister}>
          Đăng ký
        </Button>
      </div>

      <AuthDialog 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        initialView={initialView}
      />
    </>
  );
};

export default AuthButton; 