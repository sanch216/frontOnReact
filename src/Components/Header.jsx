import { useNavigate } from 'react-router-dom';
import "./Header.css";
import { getToken, removeToken } from '../api';

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.stopPropagation();
    navigate('/');
  };

  const token = getToken();
  const handleLogout = () => {
    removeToken();
    navigate('/login');
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
          {token ? (
            // Если залогинен
            <>
              <button
                className="btn-order"
                onClick={() => navigate('/order')}
              >
                📦 Заказать доставку
              </button>
              <button
                className="btn-logout"
                onClick={handleLogout}
              >
                Выход
              </button>
            </>
          ) : (
            // Если не залогинен
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
