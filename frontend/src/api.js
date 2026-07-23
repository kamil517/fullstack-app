// frontend/src/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('🔗 API URL:', API_URL);

export const api = {
    // Auth
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Login API error:', error);
            throw error;
        }
    },

    async register(name, email, password, role) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Register API error:', error);
            throw error;
        }
    },

    async getNotices() {
        try {
            const response = await fetch(`${API_URL}/notices`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Get notices error:', error);
            throw error;
        }
    },

    async createNotice(formData) {
        try {
            const response = await fetch(`${API_URL}/notices`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Create notice error:', error);
            throw error;
        }
    },

    async getUsers() {
        try {
            const response = await fetch(`${API_URL}/users`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Get users error:', error);
            throw error;
        }
    }
};

export default api;