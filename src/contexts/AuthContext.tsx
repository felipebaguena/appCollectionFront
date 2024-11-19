'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    loading: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const decodedToken = jwtDecode<{ role: string; name: string; email: string }>(token);
                    setUserRole(decodedToken.role);
                    setUser({
                        name: decodedToken.name,
                        email: decodedToken.email
                    });
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error decodificando token:', error);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('access_token', token);
        setIsAuthenticated(true);
        try {
            const decodedToken = jwtDecode<{ role: string; name: string; email: string }>(token);
            setUserRole(decodedToken.role);
            setUser({
                name: decodedToken.name,
                email: decodedToken.email
            });
        } catch (error) {
            console.error('Error decodificando token:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        setUserRole(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, loading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};