import { set, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import styles from './Registration.module.css';
import api from '../api';
import { setToken } from '../api';

export default function Registration() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const onSubmit = async (data) => {
        const { confirmPassword, ...submitData } = data;

        const role = submitData.userType || 'CLIENT';
        const endpoint = role === 'COURIER' ? '/auth/courier_signup' : '/auth/client_signup';
        try {
            console.info('Signup payload:', { endpoint, submitData });
            const res = await api.post(endpoint, submitData, { withCredentials: false });

            // Бэк возвращает строку "Registration Successful" или "Email Already Exists"
            const message = res.data;
            console.log('Registration response:', message);

            if (message === "Registration Successful") {
                alert('Регистрация прошла успешно! Войдите в систему.');
                window.location.href = '/login';
            } else {
                alert(message);
            }
        } catch (err) {
            console.error('Signup error raw:', err);
            if (err?.response) {
                const status = err.response.status;
                const statusText = err.response.statusText;
                const body = err.response.data;
                const headers = err.response.headers;
                console.error('Signup error details:', { status, statusText, headers, body });
                alert(body || statusText || `Ошибка регистрации: ${status}`);
            } else if (err?.request) {
                console.error('No response received, request:', err.request);
                alert('Сервер не ответил. Проверьте CORS / сетевое соединение.');
            } else {
                alert(err.message || 'Ошибка сети');
            }
        }
    };

    const password = watch('password');

    const e164 = /^\+?[1-9]\d{1,14}$/;

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
                    >
                        Регистрация
                    </motion.h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Email */}
                        <motion.div
                            className={styles.field}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className={styles.label}>Email</label>
                            <input
                                {...register('email', {
                                    required: 'Пожалуйста, введите ваш email',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Некорректный формат email',
                                    },
                                })}
                                type="email"
                                placeholder="example@mail.ru"
                                className={styles.input}
                            />
                            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                        </motion.div>

                        {/* Имя */}
                        <motion.div
                            className={styles.field}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className={styles.label}>Имя</label>
                            <input
                                {...register('fullName', {
                                    required: 'Пожалуйста, введите ваше имя',
                                })}
                                placeholder="Иван"
                                className={styles.input}
                            />
                            {errors.fullName && <span className={styles.error}>{errors.fullName.message}</span>}
                        </motion.div>

                        {/* Телефон */}
                        <motion.div
                            className={styles.field}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label className={styles.label}>Телефон</label>
                            <input
                                {...register('phoneNumber', {
                                    required: 'Пожалуйста, введите ваш номер телефона',
                                    pattern: {
                                        value: e164,
                                        message: 'Неверный формат номера.'
                                    }
                                })}
                                placeholder="+996148814881"
                                className={styles.input}
                            />
                            {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber.message}</span>}
                        </motion.div>

                        {/* Пароль */}
                        <motion.div
                            className={styles.field}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label className={styles.label}>Пароль</label>
                            <input
                                {...register('password', {
                                    required: 'Пожалуйста, введите пароль',
                                    minLength: {
                                        value: 8,
                                        message: 'Пароль должен быть не менее 8 символов',
                                    },
                                })}
                                type="password"
                                placeholder="********"
                                className={styles.input}
                            />
                            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                        </motion.div>

                        {/* Повторите пароль */}
                        <motion.div
                            className={styles.field}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <label className={styles.label}>Повторите пароль</label>
                            <input
                                {...register('confirmPassword', {
                                    required: 'Пожалуйста, подтвердите пароль',
                                    validate: (value) => value === password || 'Пароли не совпадают',
                                })}
                                type="password"
                                placeholder="********"
                                className={styles.input}
                            />
                            {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword.message}</span>}
                        </motion.div>

                        <motion.div
                            className={styles.field}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <label className={styles.label}>Выберите роль</label>
                            <select className={styles.input} name="userType"
                                {...register('userType')}>
                                <option value="CLIENT">Пользователь</option>
                                <option value="COURIER">Курьер</option>
                            </select>
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
                            Зарегистрироваться
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}