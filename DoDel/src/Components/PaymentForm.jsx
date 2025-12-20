import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { paymentApi } from '../api/paymentApi';
import toast from 'react-hot-toast';
import './PaymentForm.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ amount, onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            // Создаём PaymentMethod
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (error) {
                toast.error(error.message);
                setLoading(false);
                return;
            }

            // Отправляем на backend для создания PaymentIntent
            const result = await paymentApi.createPaymentIntent(amount, paymentMethod.id);

            toast.success('Оплата прошла успешно!');
            onSuccess(paymentMethod.id);
        } catch (err) {
            console.error('Payment error:', err);
            toast.error('Ошибка при оплате');
        } finally {
            setLoading(false);
        }
    };

    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <div className="card-element-wrapper">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            <div className="payment-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-cancel"
                    disabled={loading}
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="btn-pay"
                >
                    {loading ? 'Обработка...' : `Оплатить ${amount} сом`}
                </button>
            </div>
        </form>
    );
}

export default function PaymentForm({ amount, onSuccess, onCancel }) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
    );
}
