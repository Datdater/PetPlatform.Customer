import { z } from 'zod';

export const loginSchema = z.object({
    emailOrUserNameOrPhone: z.string().min(2, 'Email hoặc tên đăng nhập hoặc số điện thoại phải có ít nhất 2 ký tự'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái in hoa')
        .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái thường')
        .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một số')
        .regex(/[!@#$%^&*]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt'),
    confirmPassword: z.string(),
    phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 ký tự'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>; 