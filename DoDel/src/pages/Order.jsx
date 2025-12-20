import { useState, useEffect, useCallback, useMemo } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import './Order.css';
import { orderApi } from '../api/orderApi';
import { userApi } from '../api/userApi';
import AddressInput from '../Components/AddressInput';
import OrderMapPreview from '../Components/OrderMapPreview';
import RouteMap from '../Components/RouteMap';
import PaymentForm from '../Components/PaymentForm';
import toast from 'react-hot-toast';

const libraries = ['places'];

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [userName, setUserName] = useState("Пользователь");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        srcAddress: '',
        srcCity: 'Bishkek',
        srcLat: null,
        srcLng: null,
        destAddress: '',
        destCity: 'Bishkek',
        destLat: null,
        destLng: null,
        recipientFullName: '',
        recipientPhoneNumber: '',
        vehicleType: 'MEDIUM'
    });

    const [routePreview, setRoutePreview] = useState(null);
    const [orderInit, setOrderInit] = useState(null);

    const { isLoaded: isGoogleLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries
    });

    const srcLocation = useMemo(() => {
        if (formData.srcLat && formData.srcLng) {
            return { lat: formData.srcLat, lng: formData.srcLng };
        }
        return null;
    }, [formData.srcLat, formData.srcLng]);

    const destLocation = useMemo(() => {
        if (formData.destLat && formData.destLng) {
            return { lat: formData.destLat, lng: formData.destLng };
        }
        return null;
    }, [formData.destLat, formData.destLng]);

    const isStep1Valid = useMemo(() => {
        return (
            formData.srcAddress &&
            formData.srcLat &&
            formData.destAddress &&
            formData.destLat &&
            formData.recipientFullName &&
            formData.recipientPhoneNumber
        );
    }, [formData]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setOrders([]);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setLoading(false);
        }
    };

    const handleSrcPlaceSelected = useCallback((placeData) => {
        console.log('📍 Source selected:', placeData);
        setFormData(prev => ({
            ...prev,
            srcAddress: placeData.address,
            srcLat: placeData.lat,
            srcLng: placeData.lng,
            srcCity: placeData.city || prev.srcCity
        }));
    }, []);

    const handleDestPlaceSelected = useCallback((placeData) => {
        console.log('🎯 Destination selected:', placeData);
        setFormData(prev => ({
            ...prev,
            destAddress: placeData.address,
            destLat: placeData.lat,
            destLng: placeData.lng,
            destCity: placeData.city || prev.destCity
        }));
    }, []);

    const handleRouteCalculated = useCallback((routeData) => {
        setRoutePreview(routeData);
    }, []);

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmitStep1 = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Вы не авторизованы!');
            window.location.href = '/login';
            return;
        }

        if (!formData.srcLat || !formData.destLat) {
            toast.error('Выберите адреса из списка');
            return;
        }

        const orderData = {
            srcAddress: formData.srcAddress,
            destAddress: formData.destAddress,
            srcCity: formData.srcCity,
            destCity: formData.destCity,
            srcLat: formData.srcLat,
            srcLng: formData.srcLng,
            destLat: formData.destLat,
            destLng: formData.destLng,
            recipientFullName: formData.recipientFullName,
            recipientPhoneNumber: formData.recipientPhoneNumber,
            vehicleType: formData.vehicleType
        };

        console.log('📦 Sending order:', orderData);

        try {
            toast.loading('Рассчитываем стоимость...', { id: 'init' });
            const response = await orderApi.initializeOrder(orderData);
            console.log('✅ Order initialized:', response);
            setOrderInit(response);
            toast.success('Маршрут построен!', { id: 'init' });
            setStep(2);
        } catch (err) {
            console.error('❌ Error:', err);

            if (err?.code === 'ERR_NETWORK') {
                toast.error('CORS ошибка!', { id: 'init' });
                return;
            }

            if (err?.response?.status === 401) {
                toast.error('Сессия истекла', { id: 'init' });
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }

            toast.error(err?.response?.data?.message || 'Ошибка', { id: 'init' });
        }
    };

    const handleConfirmOrder = async () => {
        const choice = window.confirm('Оплата:\n\nОК - Наличными\nОтмена - Картой');
        if (choice) {
            handleCashPayment();
        } else {
            setStep(3);
        }
    };

    const handleCashPayment = async () => {
        try {
            toast.loading('Создаём заказ...', { id: 'cash' });
            await orderApi.createOrderCash(orderInit.orderToken);
            toast.success('Заказ создан!', { id: 'cash' });
            searchForCourier();
        } catch (err) {
            console.error('Cash error:', err);
            toast.error('Ошибка', { id: 'cash' });
        }
    };

    const searchForCourier = async () => {
        try {
            toast.loading('Ищем курьера...', { id: 'courier' });
            await orderApi.findCourier(orderInit.orderToken);
            toast.success('Курьер найден!', { id: 'courier' });
            closeModal();
            fetchOrders();
        } catch (err) {
            console.error('Courier error:', err);
            if (err?.response?.status === 408) {
                toast.dismiss('courier');
                if (window.confirm('Курьер не найден. Расширить поиск?')) {
                    searchForCourierFar();
                } else {
                    closeModal();
                }
            } else {
                toast.error('Ошибка поиска', { id: 'courier' });
            }
        }
    };

    const searchForCourierFar = async () => {
        try {
            toast.loading('Расширенный поиск...', { id: 'far' });
            await orderApi.findCourierFar(orderInit.orderToken);
            toast.success('Курьер найден!', { id: 'far' });
            closeModal();
            fetchOrders();
        } catch (err) {
            toast.error('Курьер не найден', { id: 'far' });
            closeModal();
        }
    };

    const handlePaymentSuccess = async () => {
        searchForCourier();
    };

    const closeModal = async () => {
        if (orderInit?.orderToken) {
            try {
                await orderApi.cancelOrderInit(orderInit.orderToken);
            } catch (err) {
                console.error('Cancel error:', err);
            }
        }
        setIsModalOpen(false);
        setStep(1);
        setOrderInit(null);
        setRoutePreview(null);
        setFormData({
            srcAddress: '',
            srcCity: 'Bishkek',
            srcLat: null,
            srcLng: null,
            destAddress: '',
            destCity: 'Bishkek',
            destLat: null,
            destLng: null,
            recipientFullName: '',
            recipientPhoneNumber: '',
            vehicleType: 'MEDIUM'
        });
    };

    const vehicleTypeMap = {
        'SMALL': 'Маленький',
        'MEDIUM': 'Средний',
        'BIG': 'Большой'
    };

    if (loading) return <div className="order-page">Загрузка...</div>;

    return (
        <div className="order-page">
            <div className="welcome-section">
                <div className="container">
                    <h2>Привет, {userName}! 👋</h2>
                    <p>Оформите заказ или посмотрите историю</p>
                </div>
            </div>

            <div className="orders-section">
                <div className="container">
                    <div className="section-header">
                        <h3>Мои заказы</h3>
                        <button className="btn-create-order" onClick={() => setIsModalOpen(true)}>
                            📦 Создать заказ
                        </button>
                    </div>

                    <div className="orders-list">
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <div key={order.orderId} className="order-card">
                                    <div className="order-header">
                                        <div className="order-number">Заказ #{order.orderId}</div>
                                        <div className="order-price">{order.price} сом</div>
                                    </div>
                                    <div className="order-body">
                                        <div className="order-route">
                                            <span>📍 {order.srcAddress}</span>
                                            <span> → </span>
                                            <span>🎯 {order.destAddress}</span>
                                        </div>
                                        <div className="order-status">
                                            <span className={`status-badge status-${order.orderStatus?.toLowerCase()}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📦</div>
                                <h3>Нет заказов</h3>
                                <p>Создайте первый заказ!</p>
                                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                                    Создать заказ
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {step === 1 && '📝 Оформление заказа'}
                                {step === 2 && '🗺️ Подтверждение'}
                                {step === 3 && '💳 Оплата'}
                            </h2>
                            <button className="btn-close" onClick={closeModal}>✕</button>
                        </div>

                        {step === 1 && (
                            <form onSubmit={handleSubmitStep1} className="order-form">
                                <div className="form-section">
                                    <h4>📍 Маршрут</h4>

                                    <div className="form-row">
                                        {isGoogleLoaded ? (
                                            <AddressInput
                                                label="Откуда (А) *"
                                                placeholder="Введите адрес..."
                                                onPlaceSelected={handleSrcPlaceSelected}
                                                value={formData.srcAddress}
                                                required
                                            />
                                        ) : (
                                            <div className="form-group">
                                                <label>Откуда *</label>
                                                <input type="text" placeholder="Загрузка..." disabled />
                                            </div>
                                        )}

                                        {isGoogleLoaded ? (
                                            <AddressInput
                                                label="Куда (Б) *"
                                                placeholder="Введите адрес..."
                                                onPlaceSelected={handleDestPlaceSelected}
                                                value={formData.destAddress}
                                                required
                                            />
                                        ) : (
                                            <div className="form-group">
                                                <label>Куда *</label>
                                                <input type="text" placeholder="Загрузка..." disabled />
                                            </div>
                                        )}
                                    </div>

                                    <OrderMapPreview
                                        srcLocation={srcLocation}
                                        destLocation={destLocation}
                                        onRouteCalculated={handleRouteCalculated}
                                    />

                                    {routePreview && (
                                        <div className="route-preview-info">
                                            <span>📏 {routePreview.distanceText}</span>
                                            <span>⏱️ {routePreview.durationText}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="form-section">
                                    <h4>�� Получатель</h4>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Имя *</label>
                                            <input
                                                type="text"
                                                name="recipientFullName"
                                                placeholder="ФИО"
                                                value={formData.recipientFullName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Телефон *</label>
                                            <input
                                                type="tel"
                                                name="recipientPhoneNumber"
                                                placeholder="+996..."
                                                value={formData.recipientPhoneNumber}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h4>🚗 Транспорт</h4>
                                    <div className="vehicle-selector">
                                        {['SMALL', 'MEDIUM', 'BIG'].map(type => (
                                            <label key={type} className={`vehicle-option ${formData.vehicleType === type ? 'selected' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="vehicleType"
                                                    value={type}
                                                    checked={formData.vehicleType === type}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="vehicle-icon">
                                                    {type === 'SMALL' ? '🛵' : type === 'MEDIUM' ? '🚗' : '🚛'}
                                                </span>
                                                <span className="vehicle-name">{vehicleTypeMap[type]}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={closeModal}>
                                        Отмена
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={!isStep1Valid}>
                                        Далее →
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 2 && orderInit && (
                            <div className="order-confirmation">
                                <RouteMap
                                    srcAddress={orderInit.srcAddress}
                                    destAddress={orderInit.destAddress}
                                />
                                <div className="confirmation-details">
                                    <div className="detail-row">
                                        <span>Расстояние:</span>
                                        <strong>{(orderInit.distanceMeters / 1000).toFixed(1)} км</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Время:</span>
                                        <strong>{Math.round(orderInit.durationMinutes)} мин</strong>
                                    </div>
                                    <div className="detail-row total">
                                        <span>Стоимость:</span>
                                        <strong className="price">{orderInit.price} сом</strong>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button className="btn-secondary" onClick={() => setStep(1)}>← Назад</button>
                                    <button className="btn-primary" onClick={handleConfirmOrder}>Оплатить →</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && orderInit && (
                            <div className="payment-section">
                                <h3>К оплате: {orderInit.price} сом</h3>
                                <PaymentForm
                                    amount={orderInit.price}
                                    onSuccess={handlePaymentSuccess}
                                    onCancel={() => setStep(2)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
