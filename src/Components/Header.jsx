import { useNavigate } from 'react-router-dom';
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы кнопки работали нормально
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div
          className="logo cursor-pointer"
          onClick={handleLogoClick}
        >
          <span className="logo-icon">🚚</span>
          <span className="logo-text">DoDel</span>
        </div>
        <div className="header-buttons">
          <button
            className="btn-login"
            onClick={() => navigate('/login')}
          >
            Войти
          </button>
          <button
            className="btn-register"
            onClick={() => navigate('/registration')}
          >
            Регистрация
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header;
