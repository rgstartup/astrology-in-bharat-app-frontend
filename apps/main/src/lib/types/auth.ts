import { User } from "./user";

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface AuthResponse {
    accessToken?: string;
    refreshToken?: string;
    user?: User;
    message?: string;
}

export interface AuthActionResponse {
    success?: boolean;
    error?: string;
    user?: User;
    message?: string;
}

export interface VerificationResponse {
    message: string;
    success?: boolean;
}
