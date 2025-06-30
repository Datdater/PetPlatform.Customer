import { client } from './client';

// Auth types
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
}

export interface IUser {
  id: string;
  name: string;
  avatar: string | null;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
export interface IMailRequest {
  email : string
}
const BASE_URL = '/auth';

// Login user
export const login = async (credentials: ILoginRequest): Promise<IAuthResponse> => {
  const response: any = await client.post(`${BASE_URL}/login`, credentials);
  
  // Store tokens in localStorage
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  //reload page
  window.location.reload();
  return response.data;
};

// Refresh token
export const refreshToken = async (): Promise<IAuthResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response: any = await client.post(`${BASE_URL}/refresh-token`, {
    refreshToken
  });

  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Register new user
export const register = async (userData: IRegisterRequest): Promise<IAuthResponse> => {
  const response: any = await client.post(`${BASE_URL}/register`, userData);
  
  // Store tokens in localStorage if registration auto-logs in
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

// Get current user
export const getCurrentUser = (): IUser | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Error handling helper
export const handleAuthError = (error: any): string => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return 'Thông tin đăng nhập không hợp lệ';
      case 401:
        return 'Email hoặc mật khẩu không đúng';
      case 403:
        return 'Tài khoản của bạn đã bị khóa';
      case 404:
        return 'Tài khoản không tồn tại';
      case 409:
        return 'Email đã được sử dụng';
      default:
        return 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn';
    }
  } else if (error.request) {
    return 'Không nhận được phản hồi từ máy chủ';
  } else {
    return 'Lỗi khi thiết lập yêu cầu';
  }
};

export const sendEmailConfirmation = async (mail: IMailRequest): Promise<void> => {
  try {
    await client.post(`${BASE_URL}/email?email=${mail.email}`);
  } catch (error) {
    throw handleAuthError(error);
  }
}; 