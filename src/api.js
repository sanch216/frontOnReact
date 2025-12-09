import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "/api";
const api = axios.create({
    baseURL: BASE, // базовый урл бэка локалхост:8080/api
    headers: { "Content-Type": "application/json" }, // все запросы в JSON
    timeout: 10000, // время 10 сек
    withCredentials: false, // кукис
});

// @param { string } token JWT 

//------------------------------------------------------------------------------
// методы для работы с токеном в localStorage
export function setToken(token) {
    localStorage.setItem('token', token)
}
// @returns { string | null }
export function getToken() {
    const token = localStorage.getItem('token')
    return token;
}
export function removeToken() {
    localStorage.removeItem('token');
}
//------------------------------------------------------------------------------



// удобно: вызвать в консоли window.api.pingBackend() для проверки соединения
async function pingBackend() {
    const tryPaths = ['/actuator/health', '/health', '/api/health', '/'];
    for (const p of tryPaths) {
        try {
            const res = await api.get(p);
            return { path: p, status: res.status, data: res.data };
        } catch (e) {
            // пропускаем и пробуем следующий
        }
    }
    // если ничего не ответило успешно — пробуем прямой запрос к базовому URL (fetch для полной информации)
    try {
        const res = await fetch(api.defaults.baseURL, { method: 'GET', credentials: api.defaults.withCredentials ? 'include' : 'omit' });
        return { path: api.defaults.baseURL, status: res.status, statusText: res.statusText };
    } catch (e) {
        throw new Error('Ping failed: ' + (e.message || String(e)));
    }
}

// helper для переключения (используйте только для тестов/диагностики)
export function setWithCredentials(flag) {
    api.defaults.withCredentials = !!flag;
}

// экспортируем функцию для удобного вызова из консоли
export { pingBackend };

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

// логируем ответы и расширенно обрабатываем 401
api.interceptors.response.use(
    (response) => {
        // короткий лог успешных ответов
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
    (error) => {
        const status = error?.response?.status;
        const serverData = error?.response?.data;
        const statusText = error?.response?.statusText;
        const headers = error?.response?.headers;
        const req = error?.request;

        console.error('[API ERROR] status:', status, 'statusText:', statusText);
        console.error('[API ERROR] response.data:', serverData);
        console.error('[API ERROR] response.headers:', headers);
        console.error('[API ERROR] request object:', req);

        if (status === 401) {
            removeToken();
            window.location.href = '/login';
            // может быть пустой body — смотрим заголовки (WWW-Authenticate) и statusText
            console.warn('API 401 Unauthorized — headers/statusText:', { statusText, headers });

        } else {
            console.error('API error', status, serverData || error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
