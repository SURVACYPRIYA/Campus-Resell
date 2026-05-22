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
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const res = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(sanitizeUser(res.data.data.user));
        } catch (err) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(sanitizeUser(res.data.data.user));
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/register`, { name, email, password });
        localStorage.setItem('token', res.data.token);
        setUser(sanitizeUser(res.data.data.user));
        return res.data;
    };

    const googleLogin = async (token, isAccessToken = false) => {
        const payload = isAccessToken ? { accessToken: token } : { token };
        const res = await axios.post(`${API_URL}/google`, payload);
        localStorage.setItem('token', res.data.token);
        setUser(sanitizeUser(res.data.data.user));
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
