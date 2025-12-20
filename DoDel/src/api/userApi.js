import api from '../api';

export const userApi = {
    // Получить информацию о текущем пользователе
    getUserInfo: async () => {
        try {
            const response = await api.get('/user/get_info');
            return response.data;
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    }
};
