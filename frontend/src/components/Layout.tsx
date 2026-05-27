import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const sidebarBg = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20white%20dog%20pochacco%20character%20sitting%20on%20green%20grass%20with%20small%20flowers%2C%20kawaii%20style%2C%20simple%20clean%20background%2C%20pastel%20light%20green%20and%20white%20color%20palette%2C%20sanrio%20style%20illustration%2C%20minimal%20cute&image_size=square_hd";
const headerImg = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20white%20dog%20pochacco%20waving%20paw%2C%20kawaii%20style%2C%20black%20ears%20white%20body%2C%20light%20green%20background%2C%20simple%20flat%20illustration%2C%20sanrio%20character%20style%2C%20adorable&image_size=square_hd";
const emptyImg = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20white%20pochacco%20dog%20sleeping%20on%20cloud%2C%20kawaii%20style%2C%20dreamy%20pastel%20green%20and%20white%2C%20stars%20and%20moons%2C%20sanrio%20style%20illustration%2C%20soft%20and%20gentle&image_size=square_hd";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const blogMenus = [
    { path: '/blog', label: t('nav.blog'), icon: '📝' },
  ];

  const getPageTitle = () => {
    if (location.pathname.startsWith('/profile')) return t('nav.profile');
    const item = blogMenus.find(m => location.pathname === m.path);
    return item ? item.label : 'Pochacco';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-bg">
            <img src={sidebarBg} alt="Pochacco" className="sidebar-header-img" />
          </div>
          <div className="logo-area" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <img src={headerImg} alt="Pochacco" className="pochacco-avatar" />
            <div>
              <h1 className="logo-text">Pochacco</h1>
              <p className="logo-subtitle">帕恰狗 · 管理系统</p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">📝 {t('nav.blog')}</div>
          {blogMenus.map(item => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
          <div className="nav-section-title" style={{ marginTop: 16 }}>🏠 {t('nav.profile')}</div>
          <NavLink to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
            <span className="nav-icon">🏠</span>
            <span className="nav-label">{t('nav.profile')}</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <img src={emptyImg} alt="Pochacco" className="sidebar-footer-img" />
        </div>
      </aside>
      <main className="main-content">
        <header className="top-bar">
          <h2 className="page-title">{getPageTitle()}</h2>
          <div className="top-bar-right">
            <button className="top-toggle-btn" onClick={toggleLang} title={t('label.lang')}>
              {lang === 'zh' ? '🇨🇳 中' : '🇬🇧 EN'}
            </button>
            <button className="top-toggle-btn" onClick={toggleTheme} title={t('label.theme')}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="top-user-info">
              <span className="top-user-name">{user?.name || 'Pochacco'}</span>
              <button className="top-logout-btn" onClick={handleLogout}>
                {lang === 'zh' ? '退出' : 'Logout'}
              </button>
            </div>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
