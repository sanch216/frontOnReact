import { use } from "react";
import "./Header.css"
import { useNavigate } from 'react-router-dom';



function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <span className="logo-icon">🚚</span>
          <span className="logo-text">DoDel</span>
        </div>
        <div className="header-buttons">

          <button className="btn-login" onClick={() => navigate('/login')}>Войти</button>
          <button className="btn-register" onClick={() => navigate('/registration')}>Регистрация</button>

        </div>
      </div>
    </header>
  )
}

export default Header