// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back, Admin! 👋');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      const msgs = {
        'auth/user-not-found':  'No account found with this email.',
        'auth/wrong-password':  'Incorrect password.',
        'auth/invalid-email':   'Invalid email address.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      };
      setError(msgs[err.code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <div className="login-card glass-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <span>🔐</span>
          </div>
          <h1 className="login-title">{t('admin.login_title')}</h1>
          <p className="login-subtitle">Access the portfolio admin panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">{t('admin.email')}</label>
            <div className="input-wrapper">
              <FiMail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="form-input input-with-icon"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">{t('admin.password')}</label>
            <div className="input-wrapper">
              <FiLock size={16} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input input-with-icon input-with-right-icon"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="show-pass-btn"
                onClick={() => setShowPass(p => !p)}
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary login-submit-btn" disabled={loading}>
            {loading ? (
              <><div className="spinner" /> Logging in...</>
            ) : (
              <><FiLogIn size={16} /> {t('admin.login_btn')}</>
            )}
          </button>
        </form>

        <p className="login-back">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            ← Back to Portfolio
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
