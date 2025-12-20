import api from '../api';

export const paymentApi = {
    // Создать платежный интент
    createPaymentIntent: async (amount, paymentMethodId) => {
        try {
            const response = await api.post('/payments/intent', null, {
                params: { amount, paymentMethodId }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    },

    // Сохранить метод платежа
    savePaymentMethod: async (paymentMethodId) => {
        try {
            const response = await api.post('/payments/save_method', null, {
                params: { paymentMethodId }
            });
            return response.data;
        } catch (error) {
            console.error('Error saving payment method:', error);
            throw error;
        }
    },

    // Получить сохраненные методы платежа
    getSavedMethods: async () => {
        try {
            const response = await api.get('/payments/methods');
            return response.data;
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            throw error;
        }
    }
};
