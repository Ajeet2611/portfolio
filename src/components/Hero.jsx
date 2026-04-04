// src/components/Hero.jsx
import { useLang } from '../context/LanguageContext';
import useTypingEffect from '../hooks/useTypingEffect';
import {
  FiLinkedin, FiGithub, FiYoutube, FiArrowDown, FiDownload, FiMail
} from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
  const { t } = useLang();

  const roles = t('hero.roles');
  const displayText = useTypingEffect(Array.isArray(roles) ? roles : [], 80, 40, 2200);

  const socialLinks = [
    {
      icon: <FiLinkedin size={20} />,
      href: 'https://www.linkedin.com/in/ajeet-prasad-dev',
      label: 'LinkedIn',
      color: '#0077b5',
    },
    {
      icon: <FiGithub size={20} />,
      href: 'https://github.com/Ajeet2611',
      label: 'GitHub',
      color: '#fff',
    },
    {
      icon: <FiYoutube size={20} />,
      href: '#',
      label: 'YouTube',
      color: '#ff0000',
    },
  ];

  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      {/* Animated background grid */}
      <div className="hero-grid" aria-hidden="true" />

      {/* Floating particles */}
      <div className="particles" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="particle" style={{
            '--delay': `${Math.random() * 8}s`,
            '--duration': `${6 + Math.random() * 6}s`,
            '--x': `${Math.random() * 100}%`,
            '--size': `${2 + Math.random() * 4}px`,
          }} />
        ))}
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge animate-badge">
            <span className="badge-dot" />
            <span>Available for opportunities</span>
          </div>

          {/* Greeting */}
          <p className="hero-greeting animate-greeting">
            {t('hero.greeting')}
          </p>

          {/* Name */}
          <h1 className="hero-name animate-name">
            <span>Ajeet</span>
            <span className="gradient-text"> Prasad</span>
          </h1>

          {/* Typing Animation */}
          <div className="hero-typing animate-typing">
            <span className="typing-prefix">&gt; </span>
            <span className="typing-text">{displayText}</span>
            <span className="typing-cursor" aria-hidden="true">|</span>
          </div>

          {/* Description */}
          <p className="hero-description animate-desc">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta animate-cta">
            <a href="#projects" className="btn-primary" onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              {t('hero.cta_primary')}
              <FiArrowDown size={16} />
            </a>

            <a
              href="/resume.pdf"
              download="Ajeet_Prasad_Resume.pdf"
              className="btn-outline"
            >
              <FiDownload size={16} />
              {t('hero.cta_secondary')}
            </a>

            <a href="#contact" className="btn-ghost" onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <FiMail size={16} />
              {t('hero.cta_contact')}
            </a>
          </div>

          {/* Social Links */}
          <div className="hero-socials animate-socials">
            <span className="socials-label">Find me on:</span>
            <div className="social-icons">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  title={social.label}
                  style={{ '--hover-color': social.color }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Visual — Code card */}
        <div className="hero-visual animate-visual">
          <div className="code-card glass-card">
            <div className="code-header">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <span className="code-filename">ajeet.py</span>
            </div>
            <div className="code-body">
              <pre><code>
{`class AjeetPrasad:
  name = "Ajeet Prasad"
  role = "Developer"
  location = "Wardha, India"
  
  skills = [
    "Python", "Flutter",
    "Firebase", "C++", "SQL"
  ]
  
  passion = "AI & ML"
  status = "Open to work 🚀"
  
  def say_hello(self):
    return "Let's build something!"`}
              </code></pre>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="stat-card stat-card-1 glass-card">
            <span className="stat-icon">🎓</span>
            <div>
              <p className="stat-value">BCA</p>
              <p className="stat-label">Student 2023-26</p>
            </div>
          </div>

          <div className="stat-card stat-card-2 glass-card">
            <span className="stat-icon">💡</span>
            <div>
              <p className="stat-value">10+</p>
              <p className="stat-label">Skills</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button className="scroll-indicator" onClick={scrollToNext} aria-label="Scroll down">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll</span>
      </button>
    </section>
  );
};

export default Hero;
