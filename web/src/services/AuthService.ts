import axios from 'axios';
import {AuthResponse} from "../models/AuthResponse.ts";
import {RegisterRequest} from "../models/RegisterRequest.ts";
import {LoginRequest} from "../models/LoginRequest.ts";
import {User} from "../models/User.ts";

const TOKEN_KEY = 'TOKEN_KEY';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN_KEY';
const API_URL = 'http://127.0.0.1:8080/api/v1';

const setAuthToken = (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const clearAuthToken = () => {
    axios.defaults.headers.common['Authorization'] = '';
};

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const saveTokens = (authResponse: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
};

const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const AuthService = {
    register: async (request: RegisterRequest): Promise<any> => {
        return axios.post(`${API_URL}/auth/register`, request);
    },

    login: async (request: LoginRequest): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/authenticate`, request);
        saveTokens(response.data);
        setAuthToken(response.data.token);
        return response.data;
    },

    logout: async (): Promise<void> => {
        clearTokens();
        clearAuthToken();
    },

    fetchUserData: async (token: string): Promise<User | undefined> => {
        try {
            const response = await axios.get<User>(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (e) {
            console.error('Failed to load user: ', e);
            return undefined;
        }
    },

    validateToken: async (token: string): Promise<boolean> => {
        try {
            const response = await axios.post(`${API_URL}/auth/token/validate-token?token=${token}`);
            return response.data;
        } catch (e) {
            console.error('Failed to validate token', e);
            return false;
        }
    },

    refreshAuthToken: async (refreshToken: string): Promise<AuthResponse | null> => {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/token/refresh-token?token=${refreshToken}`, { refreshToken });
            saveTokens(response.data);
            setAuthToken(response.data.token);
            return response.data;
        } catch (e) {
            console.error('Failed to refresh token', e);
            return null;
        }
    },

    loadToken: async (): Promise<{ token: string, refreshToken: string } | null> => {
        const token = getToken();
        const refreshToken = getRefreshToken();

        if (token) {
            const isValid = await AuthService.validateToken(token);
            if (isValid) {
                setAuthToken(token);
                return { token, refreshToken: refreshToken || '' };
            } else if (refreshToken) {
                const newAuthState = await AuthService.refreshAuthToken(refreshToken);
                if (newAuthState) {
                    return { token: newAuthState.token, refreshToken: newAuthState.refreshToken };
                }
            }
        }
        return null;
    }
};
