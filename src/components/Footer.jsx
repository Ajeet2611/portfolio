// src/components/Footer.jsx
import { useLang } from '../context/LanguageContext';
import { FiLinkedin, FiGithub, FiYoutube, FiHeart, FiArrowUp } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const { t } = useLang();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = [
    { label: t('nav.home'),         href: '#home' },
    { label: t('nav.about'),        href: '#about' },
    { label: t('nav.skills'),       href: '#skills' },
    { label: t('nav.projects'),     href: '#projects' },
    { label: t('nav.certificates'), href: '#certificates' },
    { label: t('nav.contact'),      href: '#contact' },
  ];

  const socials = [
    { icon: <FiLinkedin size={18} />, href: 'https://www.linkedin.com/in/ajeet-prasad-dev', label: 'LinkedIn' },
    { icon: <FiGithub  size={18} />, href: 'https://github.com/Ajeet2611',                  label: 'GitHub'   },
    { icon: <FiYoutube size={18} />, href: '#',                                              label: 'YouTube'  },
  ];

  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-logo">
            <span className="logo-bracket">&lt;</span>
            <span className="gradient-text">AP</span>
            <span className="logo-bracket">/&gt;</span>
          </span>
          <p className="footer-tagline">
            Building impactful experiences, one line of code at a time.
          </p>
          <div className="footer-socials">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-links">
          <h4 className="footer-links-title">Quick Links</h4>
          <ul>
            {links.map(l => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech stack used */}
        <div className="footer-tech">
          <h4 className="footer-links-title">Built With</h4>
          {['React.js', 'Firebase', 'Vite', 'EmailJS', 'CSS3'].map(t => (
            <span key={t} className="footer-tech-tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>
            © {new Date().getFullYear()} Ajeet Prasad. {t('footer.rights')}
          </p>
          <p className="footer-made">
            {t('footer.made_with')}
          </p>
        </div>
      </div>

      {/* Back to top */}
      <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
        <FiArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;
