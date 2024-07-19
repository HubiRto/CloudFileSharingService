import {createContext, useContext, useEffect, useState} from "react";
import {User} from "@/models/User.ts";
import {AuthResponse} from "@/models/AuthResponse.ts";
import {RegisterRequest} from "@/models/RegisterRequest.ts";
import {LoginRequest} from "@/models/LoginRequest.ts";
import {AuthService} from "@/services/AuthService.ts";

interface AuthProps {
    user: User | undefined;
    authState?: AuthResponse;
    onRegister?: (request: RegisterRequest) => Promise<any>;
    onLogin?: (request: LoginRequest) => Promise<any>;
    onLogout?: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthProps>({
    user: undefined,
    isLoading: true
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<AuthResponse | undefined>(undefined);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            const authTokens = await AuthService.loadToken();
            if (authTokens) {
                const user = await AuthService.fetchUserData(authTokens.token);
                setUser(user);
                setAuthState({token: authTokens.token, refreshToken: authTokens.refreshToken});
            } else {
                await AuthService.logout();
            }
            setIsLoading(false);
        };

        loadToken();
    }, []);

    const register = async (request: RegisterRequest) => {
        try {
            await AuthService.register(request);
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                throw new Error('User with this email already exist');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }
    };

    const login = async (request: LoginRequest) => {
        try {
            const authResponse = await AuthService.login(request);
            setAuthState(authResponse);
            const user = await AuthService.fetchUserData(authResponse.token);
            setUser(user);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                throw new Error("Invalid email or password");
            } else if (error.response && error.response.status === 404) {
                throw new Error("User with this email don't exist");
            } else {
                throw new Error("Server error");
            }
        }
    };

    const logout = async () => {
        await AuthService.logout();
        setAuthState(undefined);
        setUser(undefined);
    };

    const value = {
        user,
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
