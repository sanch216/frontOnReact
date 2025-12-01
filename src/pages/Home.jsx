import './Home.css'
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Быстрая доставка по всему городу
        </h1>
        <p className="hero-subtitle">
          Доставим ваш заказ в течение 2 часов
        </p>
        <button className="btn-start" onClick={() => navigate('/login')}>Начать работу</button>
      </div>
    </section>
  )
}

export default Home