import React, { useEffect, useState } from 'react';
import api from "../api";

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/orders')
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Ошибка загрузки заказов')
                setLoading(false)
            })
    }, [])

    if (loading) return <div>Загрузка...</div>
    if (error) return <div>{error}</div>

    return (
        <ul>
            {orders.map(order => (
                <li key={order.orderId}>
                    Заказ #{order.orderId}: {order.recipientFullName} ({order.orderStatus})
                </li>
            ))}
        </ul>
    )
}