import React, {createContext, useState, useEffect, ReactNode} from 'react';
import * as authService from './authService';
import type {User, AuthContextType} from '../types/auth';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await authService.getStoredToken();
                if (token) {
                    try {
                        const decoded = authService.decodeToken(token);
                        setUser(decoded);
                    } catch (error) {
                        console.warn('Failed to decode token:', error);
                        await authService.logout();
                    }
                }
            } catch (error) {
                console.error('Failed to load user:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        const decoded = await authService.login(email, password);
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