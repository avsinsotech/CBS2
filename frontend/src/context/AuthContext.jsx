import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userSession');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem('userSession', JSON.stringify(userData));
        localStorage.setItem('loginCode', userData.user.loginCode);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('userSession');
        localStorage.removeItem('loginCode');
        setUser(null);
    };

    if (loading) return null; // or a loading spinner

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
