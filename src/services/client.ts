import axios from 'axios';
import { refreshToken } from './auth.service';

const API_URL = 'https://prn-222.food/api/v1';

export const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
client.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
client.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await refreshToken();
                
                // Update the authorization header
                originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                
                // Retry the original request
                return client(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, logout the user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
); 