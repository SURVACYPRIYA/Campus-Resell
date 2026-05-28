import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../axios';

const AuthContext = createContext();

// Ensure user object always has both _id and id
const sanitizeUser = (u) => {
    if (!u) return null;
    const userId = u._id || u.id;
    return { ...u, _id: userId, id: userId };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = '/api/auth';

    useEffect(() => {
        // Just try fetching user; cookies will be sent automatically
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API_URL}/me`);
            setUser(sanitizeUser(res.data.data.user));
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        setUser(sanitizeUser(res.data.data.user));
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/register`, { name, email, password });
        setUser(sanitizeUser(res.data.data.user));
        return res.data;
    };

    const googleLogin = async (token, isAccessToken = false) => {
        const payload = isAccessToken ? { accessToken: token } : { token };
        const res = await axios.post(`${API_URL}/google`, payload);
        setUser(sanitizeUser(res.data.data.user));
        return res.data;
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/logout`);
        } catch (err) {
            console.error('Logout error:', err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
