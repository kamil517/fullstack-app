import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;
    const isAdmin = user?.role === "admin";
    const isFaculty = user?.role === "faculty";
    const isStudent = user?.role === "student";

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser && storedUser !== 'undefined') {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error('Error parsing user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const register = async (name, email, password, role) => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                name, email, password, role
            });
            
            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                return { success: true, role: response.data.user.role };
            } else {
                return { success: false, error: response.data.message || 'Registration failed' };
            }
        } catch (error) {
            return { 
                success: false, 
                error: 'Cannot connect to server on port 8080' 
            };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            
            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                return { success: true, role: response.data.user.role };
            } else {
                return { success: false, error: response.data.message || 'Login failed' };
            }
        } catch (error) {
            return { 
                success: false, 
                error: 'Cannot connect to server on port 8080' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            register, 
            login, 
            logout,
            isAuthenticated,
            isAdmin,
            isFaculty,
            isStudent
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;








