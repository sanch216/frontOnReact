import { useForm } from 'react-hook-form'
import { use } from 'react'
import { motion } from 'framer-motion';
import styles from './Registration.module.css';


export default function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm();;

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

                    <form onSubmit={handleSubmit((data) => console.log(data))}>
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
                                    {...register('password', {
                                        required: "Пожалуйста, введите ваше Имя",
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