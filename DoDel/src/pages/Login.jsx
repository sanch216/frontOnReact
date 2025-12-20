import { useForm } from 'react-hook-form'
import api, { setToken, setRefreshToken } from '../api';
import { motion } from 'framer-motion';
import styles from './Registration.module.css';
import { useNavigate } from 'react-router-dom';



export default function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const payload = { email: data.email, password: data.password };
            console.info('Login submit payload:', payload);
            const res = await api.post('/auth/login', payload, { withCredentials: false });

            // Бэк возвращает AuthResponseDto с accessToken и refreshToken
            const authResponse = res.data;
            console.log('Auth response:', authResponse);

            // Сохраняем оба токена
            setToken(authResponse.accessToken);
            setRefreshToken(authResponse.refreshToken);

            alert('Успешная авторизация');
            navigate('/order');

        } catch (err) {
            console.error('Login error raw:', err);
            if (err?.response) {
                const status = err.response.status;
                const statusText = err.response.statusText;
                const body = err.response.data;
                const headers = err.response.headers;
                console.error('Login error details:', { status, statusText, headers, body });
                if (status === 401) {
                    const message = body?.message || statusText || 'Неверный email или пароль (401)';
                    const extra = headers?.['www-authenticate'] ? ` — WWW-Authenticate: ${headers['www-authenticate']}` : '';
                    alert(message + extra);
                } else {
                    alert(body?.message || `Ошибка сервера: ${status} ${statusText}`);
                }
            } else if (err?.request) {
                console.error('No response received, request:', err.request);
                alert('Сервер не ответил. Проверьте CORS / сетевое соединение.');
            } else {
                alert(err.message || 'Ошибка сети');
            }
        }
    };

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={styles.formWrapper}
            >

                <div className={styles.formCard}>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={styles.title}
                    >Авторизация </motion.h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <motion.div
                            className={styles.field}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className={styles.field}>
                                <label className={styles.label}> Email:</label>
                                <input
                                    className={styles.input}
                                    id='email'
                                    {...register('email', {
                                        required: 'Введите корректный email',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Некорректный формат email."
                                        }
                                    })} />

                            </div>
                            {errors.email && <span className={styles.error}>{errors.email.message}</span>}

                        </motion.div>
                        <motion.div
                            className={styles.field}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className={styles.field}>
                                <label className={styles.label}>Пароль:</label>
                                <input
                                    className={styles.input}
                                    id='password'
                                    type="password"
                                    {...register('password', {
                                        required: "Пожалуйста, введите пароль",
                                    })} />

                            </div>
                            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                        </motion.div>
                        <motion.button
                            type="submit"
                            className={styles.submitButton}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Войти
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}