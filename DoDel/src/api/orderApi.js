import api from '../api';

export const orderApi = {
    // Получить список всех заказов пользователя (TODO: эндпоинт на бэке пока не готов)
    getOrders: async () => {
        try {
            const response = await api.get('/user/orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    // Инициализировать заказ (расчет цены, маршрута и т.д.)
    initializeOrder: async (orderData) => {
        try {
            // Проверяем токен
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');
            }

            console.log('🔑 Отправка с токеном:', token.substring(0, 20) + '...');

            const response = await api.post('/order/initialize', orderData);
            return response.data;
        } catch (error) {
            console.error('Error initializing order:', error);

            // Если Network Error - скорее всего CORS OPTIONS 401
            if (error.code === 'ERR_NETWORK') {
                throw new Error('CORS ошибка: Бэкенд блокирует OPTIONS запрос. Обратитесь к разработчикам бэкенда для настройки CORS.');
            }

            throw error;
        }
    },

    // Найти ближайшего курьера (исправлено: POST вместо GET)
    findCourier: async (orderToken) => {
        try {
            const response = await api.post('/order/find_courier', null, {
                params: { orderToken }
            });
            return response.data;
        } catch (error) {
            console.error('Error finding courier:', error);
            throw error;
        }
    },

    // Найти курьера в дальнем радиусе (с доплатой)
    findCourierFar: async (orderToken) => {
        try {
            const response = await api.post('/order/find_courier_far', null, {
                params: { orderToken }
            });
            return response.data;
        } catch (error) {
            console.error('Error finding courier far:', error);
            throw error;
        }
    },

    // Создать заказ с оплатой наличными
    createOrderCash: async (orderToken) => {
        try {
            const response = await api.post('/order/create_order_cash', null, {
                params: { orderToken }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating cash order:', error);
            throw error;
        }
    },

    // Отменить инициализацию заказа
    cancelOrderInit: async (orderToken) => {
        try {
            const response = await api.post('/order/cancelOrderInit', null, {
                params: { orderToken }
            });
            return response.data;
        } catch (error) {
            console.error('Error canceling order init:', error);
            throw error;
        }
    }
};
