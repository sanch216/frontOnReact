import axios from "axios";

// Временно используем прямой URL на backend для отладки
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";
const api = axios.create({
    baseURL: BASE, // базовый урл бэка локалхост:8080/api
    headers: { "Content-Type": "application/json" }, // все запросы в JSON
    timeout: 10000, // время 10 сек
    withCredentials: false, // кукис
});


//------------------------------------------------------------------------------
// методы для работы с токеном в localStorage
export function setToken(token) {
    localStorage.setItem('token', token)
}
export function getToken() {
    const token = localStorage.getItem('token')
    return token;
}
export function removeToken() {
    localStorage.removeItem('token');
}

export function setRefreshToken(refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
}

export function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

export function removeRefreshToken() {
    localStorage.removeItem('refreshToken');
}
//------------------------------------------------------------------------------


api.interceptors.request.use((config) => {
    try {
        console.info('[API REQUEST]', { // логи
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            data: config.data,
            headers: config.headers,
        });
    } catch (e) {
        console.warn('Failed to log request', e);
    }
    const token = getToken(); // получаем токен 
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}` // добавляем в хедер
        return config;
    }

    return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use(
    (response) => {
        try {
            console.info('[API RESPONSE]', {
                url: response.config?.url,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: response.data,
            });
        } catch (e) { /* ignore */ }
        return response;
    },
    async (error) => {
        const status = error?.response?.status;
        const serverData = error?.response?.data;
        const statusText = error?.response?.statusText;
        const headers = error?.response?.headers;
        const req = error?.request;
        const originalRequest = error.config;

        console.error('[API ERROR] status:', status, 'statusText:', statusText);
        console.error('[API ERROR] response.data:', serverData);
        console.error('[API ERROR] response.headers:', headers);
        console.error('[API ERROR] request object:', req);

        // Если 401 и это не запрос на /auth/login или /auth/refresh
        if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh')) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    // Попытка обновить токен
                    const response = await api.post('/auth/refresh', { refreshToken });
                    const { accessToken } = response.data;

                    setToken(accessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    console.info('[API] Token refreshed successfully');
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('[API] Refresh token failed:', refreshError);
                removeToken();
                removeRefreshToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        if (status === 401) {
            removeToken();
            removeRefreshToken();
            window.location.href = '/login';
            console.warn('API 401 Unauthorized — headers/statusText:', { statusText, headers });
        } else {
            console.error('API error', status, serverData || error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
