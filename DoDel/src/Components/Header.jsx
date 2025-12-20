import { useNavigate } from 'react-router-dom';
import "./Header.css";
import { getToken, removeToken, removeRefreshToken } from '../api';
import api from '../api';
import toast from 'react-hot-toast';

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.stopPropagation();
    navigate('/');
  };

  const token = getToken();

  const handleLogout = async () => {
    try {
      // Вызываем API logout на бэке (удаляет refresh token из БД)
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
      // Даже если бэк упал, всё равно чистим токены локально
    } finally {
      // Удаляем токены из localStorage
      removeToken();
      removeRefreshToken();
      toast.success('Вы вышли из системы');
      navigate('/login');
    }
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
                📦 Сделать заказ
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
