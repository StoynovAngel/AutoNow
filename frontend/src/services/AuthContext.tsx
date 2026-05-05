import React, {createContext, useState, useEffect, ReactNode} from 'react';
import * as authService from './authService';
import type {User, AuthContextType} from '../types/auth';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            console.log('[AuthContext] Starting loadUser...');
            try {
                console.log('[AuthContext] Getting stored token...');
                const token = await authService.getStoredToken();
                console.log('[AuthContext] Token retrieved:', token ? 'exists' : 'null');
                if (token) {
                    try {
                        console.log('[AuthContext] Decoding token...');
                        const decoded = authService.decodeToken(token);
                        console.log('[AuthContext] Token decoded successfully:', decoded);
                        setUser(decoded);
                    } catch (error) {
                        console.warn('[AuthContext] Failed to decode token:', error);
                        await authService.logout();
                    }
                }
            } catch (error) {
                console.error('[AuthContext] Failed to load user:', error);
            } finally {
                console.log('[AuthContext] Setting loading to false');
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        const decoded = await authService.login(email, password);
        console.log(decoded.id);
        setUser(decoded);
    };

    const register = async (email: string, password: string) => {
        const decoded = await authService.register(email, password);
        setUser(decoded);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
};