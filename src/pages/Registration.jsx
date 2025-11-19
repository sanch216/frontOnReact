import { useForm } from 'react-hook-form';
import './Registration.css'
export default function Registration() {

    const { register, handleSubmit, formState: { errors } } = useForm(

    );


    return (
        <div> <h1>Registration</h1>
            <div className="registration-container">
                <form onSubmit={handleSubmit((data) => console.log(data))}
                    style={{ display: 'flex', flexDirection: 'column', gap: "10px" }}>

                    <div className="form-field">
                        <label className="w-32">Email:</label>
                        <input
                            className='big-input'
                            id='email'
                            {...register('email', {
                                required: "Пожалуйста, введите ваш email.",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Некорректный формат email."
                                }
                            })}
                            placeholder='example@mail.ru' />

                    </div>
                    {errors.email && <span className="error-message">{errors.email.message}</span>}



                    <div className="form-field">
                        <label className="w-32">Имя:</label>
                        <input
                            className='big-input'
                            id='name'
                            {...register('name', {
                                required: "Пожалуйста, введите ваше Имя",
                            })}
                            placeholder='Адольф' />

                    </div>

                    {errors.name && <span className="error-message">{errors.name.message}</span>}


                    <div className="form-field">
                        <label className="w-32">Телефон:</label>
                        <input
                            className='big-input'
                            id='phoneNumber'
                            {...register('phone', { required: "Пожалуйста, введите ваш номер телефона." })}
                            placeholder='+996148814881' />
                    </div>
                    {errors.phoneNumber && <span className="error-message">{errors.phoneNumber.message}</span>}



                    <div className="form-field">
                        <label>Пароль:</label>
                        <input
                            className='big-input'
                            id='password'
                            {...register('password', { required: true })}
                            type='password'
                            placeholder='********' />
                    </div>

                    <div className="form-field">

                        <label>Повторите пароль:</label>
                        <input
                            className='big-input'
                            id='confirmPassword'
                            {...register('confirmPassword', { required: true })}
                            type='password'
                            placeholder='********' />
                    </div>


                    <div>


                    </div>


                    <button className='submit-button' type='submit'>Зарегистрироваться</button>
                </form>







            </div>
        </div>
    )
}