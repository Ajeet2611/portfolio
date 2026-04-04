// src/components/Skills.jsx
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useLang } from '../context/LanguageContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './Skills.css';

// Default skills shown before Firebase loads
const DEFAULT_SKILLS = [
  { id: '1', name: 'Python', level: 80, category: 'Language', icon: '🐍' },
  { id: '2', name: 'C / C++', level: 75, category: 'Language', icon: '⚙️' },
  { id: '3', name: 'Flutter', level: 70, category: 'Framework', icon: '💙' },
  { id: '4', name: 'Firebase', level: 68, category: 'Backend', icon: '🔥' },
  { id: '5', name: 'SQL', level: 65, category: 'Database', icon: '🗄️' },
  { id: '6', name: 'DSA', level: 70, category: 'CS Fundamentals', icon: '🧠' },
  { id: '7', name: 'MS Office', level: 85, category: 'Tools', icon: '📊' },
  { id: '8', name: 'Video Editing', level: 60, category: 'Tools', icon: '🎬' },
  { id: '9', name: 'Networking', level: 55, category: 'CS Fundamentals', icon: '🌐' },
];

const CATEGORIES = ['All', 'Language', 'Framework', 'Backend', 'Database', 'CS Fundamentals', 'Tools'];

const SkillCard = ({ skill, index }) => {
  const { ref, isVisible } = useScrollAnimation();
  const [barFilled, setBarFilled] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setBarFilled(true), 200 + index * 80);
      return () => clearTimeout(t);
    }
  }, [isVisible, index]);

  return (
    <div
      ref={ref}
      className={`skill-card glass-card animate-on-scroll ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      <div className="skill-header">
        <span className="skill-icon">{skill.icon || '💡'}</span>
        <div className="skill-info">
          <h4 className="skill-name">{skill.name}</h4>
          <span className="skill-category tag">{skill.category}</span>
        </div>
        <span className="skill-percent">{skill.level}%</span>
      </div>

      {/* Progress bar */}
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{ width: barFilled ? `${skill.level}%` : '0%' }}
        />
      </div>
    </div>
  );
};

const Skills = () => {
  const { t } = useLang();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Load skills from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'skills'), orderBy('level', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      setLoading(false);
    }, () => {
      // On error (e.g. not configured), use defaults
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  // Get only categories that have skills
  const availableCategories = ['All', ...new Set(skills.map(s => s.category))];

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <div
          ref={titleRef}
          className={`section-header animate-on-scroll ${titleVisible ? 'visible' : ''}`}
        >
          <p className="section-label">— {t('skills.subtitle')}</p>
          <h2 className="section-title">{t('skills.title')}</h2>
        </div>

        {/* Category Filter */}
        <div className="skill-filters">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="skills-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skill-skeleton" />
            ))}
          </div>
        ) : (
          <div className="skills-grid">
            {filtered.map((skill, i) => (
              <SkillCard key={skill.id} skill={skill} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
