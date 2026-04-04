// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSun, FiMoon, FiMenu, FiX, FiShield, FiLogOut
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { lang, switchLang, t } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'skills', href: '#skills' },
    { key: 'projects', href: '#projects' },
    { key: 'certificates', href: '#certificates' },
    { key: 'contact', href: '#contact' },
  ];

  // Detect scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Track active section
      const sections = navLinks.map(l => l.key);
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          {/* Logo */}
          <a href="#home" className="nav-logo" onClick={() => handleNavClick('#home')}>
            <span className="logo-bracket">&lt;</span>
            <span className="logo-name">AP</span>
            <span className="logo-bracket">/&gt;</span>
          </a>

          {/* Desktop Links */}
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  className={`nav-link ${activeSection === link.key ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {t(`nav.${link.key}`)}
                </a>
              </li>
            ))}

            {/* Admin link (only when logged in) */}
            {user && (
              <li>
                <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>
                  <FiShield size={14} />
                  {t('nav.admin')}
                </Link>
              </li>
            )}
          </ul>

          {/* Controls */}
          <div className="nav-controls">
            {/* Language Toggle */}
            <button
              className="lang-toggle"
              onClick={() => switchLang(lang === 'en' ? 'hi' : 'en')}
              title="Switch Language"
            >
              <span className={lang === 'en' ? 'active' : ''}>EN</span>
              <span className="lang-divider">|</span>
              <span className={lang === 'hi' ? 'active' : ''}>HI</span>
            </button>

            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Logout (admin only) */}
            {user && (
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <FiLogOut size={16} />
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
