// src/components/About.jsx
import { useLang } from '../context/LanguageContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import {
  FiBook, FiTarget, FiMapPin, FiCalendar, FiAward, FiCode
} from 'react-icons/fi';
import './About.css';

const About = () => {
  const { t } = useLang();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();

  const highlights = [
    { icon: <FiCode size={20} />, label: 'Languages', value: 'C, C++, Python' },
    { icon: <FiAward size={20} />, label: 'Speciality', value: 'Flutter & Firebase' },
    { icon: <FiMapPin size={20} />, label: 'Location', value: 'Wardha, India' },
    { icon: <FiCalendar size={20} />, label: 'Availability', value: 'Open to Work' },
  ];

  return (
    <section id="about" className="section about-section">
      <div className="container">
        {/* Section header */}
        <div
          ref={titleRef}
          className={`section-header animate-on-scroll ${titleVisible ? 'visible' : ''}`}
        >
          <p className="section-label">— {t('about.subtitle')}</p>
          <h2 className="section-title">{t('about.title')}</h2>
        </div>

        <div className="about-grid">
          {/* Left — Avatar + highlights */}
          <div
            ref={leftRef}
            className={`about-left animate-left ${leftVisible ? 'visible' : ''}`}
          >
            {/* Avatar card */}
            <div className="avatar-card glass-card">
              <div className="avatar-wrapper">
                <div className="avatar-placeholder">
                  <span className="avatar-initials">AP</span>
                  <div className="avatar-ring ring-1" />
                  <div className="avatar-ring ring-2" />
                </div>
                <div className="avatar-status">
                  <span className="status-dot" />
                  Available for work
                </div>
              </div>

              {/* Highlight stats */}
              <div className="highlights-grid">
                {highlights.map((item, i) => (
                  <div
                    key={item.label}
                    className="highlight-item neu-card"
                    style={{ animationDelay: `${0.1 * i}s` }}
                  >
                    <span className="highlight-icon">{item.icon}</span>
                    <div>
                      <p className="highlight-label">{item.label}</p>
                      <p className="highlight-value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Text content */}
          <div
            ref={rightRef}
            className={`about-right animate-right ${rightVisible ? 'visible' : ''}`}
          >
            {/* Description */}
            <div className="about-text glass-card">
              <p className="about-para">{t('about.description_1')}</p>
              <p className="about-para">{t('about.description_2')}</p>
            </div>

            {/* Education */}
            <div className="edu-card glass-card">
              <div className="card-header">
                <FiBook size={18} className="card-header-icon" />
                <h3>{t('about.education_title')}</h3>
              </div>
              <div className="edu-content">
                <div className="edu-badge">
                  <div className="edu-dot" />
                  <div className="edu-line" />
                </div>
                <div className="edu-info">
                  <h4 className="edu-degree">{t('about.degree')}</h4>
                  <p className="edu-university">{t('about.university')}</p>
                  <span className="tag">{t('about.year')}</span>
                </div>
              </div>
            </div>

            {/* Career Goal */}
            <div className="goal-card glass-card">
              <div className="card-header">
                <FiTarget size={18} className="card-header-icon" />
                <h3>{t('about.goal_title')}</h3>
              </div>
              <p className="goal-text">{t('about.goal')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
