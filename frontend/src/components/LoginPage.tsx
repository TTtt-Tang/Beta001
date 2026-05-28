import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';

const loginBg = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20white%20pochacco%20dog%20character%20standing%20happily%20waving%20paw%2C%20kawaii%20style%2C%20light%20green%20meadow%20with%20flowers%2C%20blue%20sky%20with%20clouds%2C%20sanrio%20style%20illustration%2C%20pastel%20colors%2C%20adorable%20and%20cheerful&image_size=landscape_16_9";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { lang, toggleLang } = useI18n();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError(lang === 'zh' ? '请输入用户名和密码' : 'Please enter username and password');
      return;
    }
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <img src={loginBg} alt="Pochacco" className="login-bg-img" />
        <div className="login-bg-overlay" />
      </div>
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🐶</div>
          <h1 className="login-title">Pochacco</h1>
          <p className="login-subtitle">{lang === 'zh' ? '帕恰狗 · 管理系统' : 'Pochacco Admin'}</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          <div className="login-field">
            <label>{lang === 'zh' ? '用户名' : 'Username'}</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={lang === 'zh' ? '请输入用户名' : 'Enter username'}
              autoComplete="username"
            />
          </div>
          <div className="login-field">
            <label>{lang === 'zh' ? '密码' : 'Password'}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={lang === 'zh' ? '请输入密码' : 'Enter password'}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (lang === 'zh' ? '登录中...' : 'Logging in...') : (lang === 'zh' ? '登 录' : 'Login')}
          </button>
        </form>
        <div className="login-footer">
          <button className="login-lang-btn" onClick={toggleLang}>
            {lang === 'zh' ? '🇬🇧 English' : '🇨🇳 中文'}
          </button>
        </div>
        <div className="login-hint">
          {lang === 'zh' ? '默认账号: admin / 123456' : 'Default: admin / 123456'}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
