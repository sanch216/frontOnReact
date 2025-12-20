import './Home.css'
import { useNavigate } from 'react-router-dom';
import { getToken } from '../api';


function Home() {
  const navigate = useNavigate();
  const token = getToken();

  const handleMainAction = () => {
    if (token) {
      navigate('/order');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Быстрая доставка по всему городу
        </h1>
        <p className="hero-subtitle">
          Доставим ваш заказ в течение 2 часов
        </p>
        <button className="btn-start" onClick={handleMainAction}>
          {token ? '📦 Заказать доставку' : '🚀 Начать работу'}
        </button>
      </div>
    </section>
  )
}

export default Home