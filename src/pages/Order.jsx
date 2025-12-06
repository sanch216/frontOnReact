import { useState } from 'react'
import './Order.css'
import Header from '../Components/Header'

export default function Order() {
    const userName = "Адольф"

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/your-api-endpoint');
                setData(response.data)
                setLoading(false)

            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false)
            }
        };
        fetchData();
    }, []);
    const orders = [
        {
            id: 1,
            date: "03.12.2025",
            time: "18:22",
            addressFrom: "ул. Ленина, 45",
            addressTo: "пр. Мира, 123",
            recipient: "Иван Иванов",
            phone: "+996700123456",
            transport: "Средний",
            sum: 350
        },
        {
            id: 2,
            date: "02.12.2025",
            time: "14:15",
            addressFrom: "ул. Пушкина, 10",
            addressTo: "ул. Гоголя, 88",
            recipient: "Мария Петрова",
            phone: "+996555987654",
            transport: "Маленький",
            sum: 250
        },
        {
            id: 3,
            date: "01.12.2025",
            time: "10:30",
            addressFrom: "ТЦ Ала-Арча",
            addressTo: "мкр. Асанбай, 5",
            recipient: "Алексей Сидоров",
            phone: "+996770111222",
            transport: "Большой",
            sum: 500
        }
    ]

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [formData, setFormData] = useState({
        addressFrom: '',
        addressTo: '',
        recipient: '',
        phone: '',
        transport: 'Средний'
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Новый заказ:', formData)
        setIsModalOpen(false)
        // Здесь будет логика отправки заказа
    }

    return (
        <div className="order-page">
            <header className="order-header">
                <div className="container">
                    <div className="logo">
                        <span className="logo-icon">🚚</span>
                        <span className="logo-text">DoDel</span>
                    </div>
                    <div className="header-buttons">
                        <button className="btn-home" onClick={() => window.location.href = '/'}>
                            Главная
                        </button>
                        <button className="btn-create-order" onClick={() => setIsModalOpen(true)}>
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </header>

            <div className="welcome-section">
                <div className="container">
                    <h2>Привет, {data.map(item => (
                        item.name
                    ))}!</h2>
                </div>
            </div>

            <div className="orders-section">
                <div className="container">
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-top">
                                    <h3 className="order-title">Заказ №{order.id}, {order.date} {order.time}</h3>
                                    <span className="order-price">{order.sum} с</span>
                                </div>

                                <div className="order-route">
                                    {order.addressFrom} &nbsp;→&nbsp; {order.addressTo}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Оформление заказа</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-field">
                                <label>Откуда забрать</label>
                                <input
                                    type="text"
                                    name="addressFrom"
                                    placeholder="Адрес отправления"
                                    value={formData.addressFrom}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Куда доставить</label>
                                <input
                                    type="text"
                                    name="addressTo"
                                    placeholder="Адрес доставки"
                                    value={formData.addressTo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Имя получателя</label>
                                <input
                                    type="text"
                                    name="recipient"
                                    placeholder="ФИО получателя"
                                    value={formData.recipient}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Номер телефона</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+996XXXXXXXXX"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Тип транспорта</label>
                                <select
                                    name="transport"
                                    value={formData.transport}
                                    onChange={handleInputChange}
                                >
                                    <option value="Маленький">Маленький</option>
                                    <option value="Средний">Средний</option>
                                    <option value="Большой">Большой</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-submit">
                                Создать заказ
                            </button>

                            <button
                                type="button"
                                className="btn-back"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ← Назад к заказам
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}