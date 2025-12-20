import api from '../api';

export const authApi = {
    // Логин пользователя
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data; // { accessToken, refreshToken }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Регистрация клиента
    registerClient: async (userData) => {
        try {
            const response = await api.post('/auth/client_signup', userData);
            return response.data; // "Registration Successful" или "Email Already Exists"
        } catch (error) {
            console.error('Client registration error:', error);
            throw error;
        }
    },

    // Регистрация курьера
    registerCourier: async (courierData) => {
        try {
            const response = await api.post('/auth/courier_signup', courierData);
            return response.data; // "Registration Successful" или "Email Already Exists"
        } catch (error) {
            console.error('Courier registration error:', error);
            throw error;
        }
    },

    // Logout (удаляет refresh token на бэке)
    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // Обновление access token через refresh token
    refreshToken: async (refreshToken) => {
        try {
            const response = await api.post('/auth/refresh', { refreshToken });
            return response.data; // { accessToken }
        } catch (error) {
            console.error('Refresh token error:', error);
            throw error;
        }
    }
};
