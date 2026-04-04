// src/components/Certificates.jsx
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useLang } from '../context/LanguageContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import './Certificates.css';

const DEFAULT_CERTS = [
  { id: 'c1', title: 'Python Programming', issuer: 'Coursera', year: '2024', image: '' },
  { id: 'c2', title: 'Flutter Development', issuer: 'Udemy', year: '2024', image: '' },
  { id: 'c3', title: 'Firebase & Cloud', issuer: 'Google', year: '2024', image: '' },
];

/* Fullscreen Lightbox */
const Lightbox = ({ certs, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent(p => (p - 1 + certs.length) % certs.length);
      if (e.key === 'ArrowRight') setCurrent(p => (p + 1) % certs.length);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [certs.length, onClose]);

  const cert = certs[current];

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}><FiX size={22} /></button>

      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        {cert.image ? (
          <img src={cert.image} alt={cert.title} className="lightbox-img" />
        ) : (
          <div className="lightbox-placeholder">
            <span>🏆</span>
            <p>{cert.title}</p>
          </div>
        )}

        <div className="lightbox-info">
          <h3>{cert.title}</h3>
          <p>{cert.issuer} — {cert.year}</p>
        </div>

        <span className="lightbox-counter">{current + 1} / {certs.length}</span>
      </div>

      {certs.length > 1 && (
        <>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={e => { e.stopPropagation(); setCurrent(p => (p - 1 + certs.length) % certs.length); }}
          >
            <FiChevronLeft size={28} />
          </button>
          <button
            className="lightbox-nav lightbox-next"
            onClick={e => { e.stopPropagation(); setCurrent(p => (p + 1) % certs.length); }}
          >
            <FiChevronRight size={28} />
          </button>
        </>
      )}
    </div>
  );
};

/* Certificate Card */
const CertCard = ({ cert, index, onClick }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`cert-card glass-card animate-on-scroll ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
      onClick={() => onClick(index)}
    >
      {/* Thumbnail */}
      <div className="cert-thumb">
        {cert.image ? (
          <img src={cert.image} alt={cert.title} />
        ) : (
          <div className="cert-thumb-placeholder">🏆</div>
        )}
        <div className="cert-zoom-icon">
          <FiMaximize2 size={18} />
        </div>
      </div>

      {/* Info */}
      <div className="cert-info">
        <h4 className="cert-title">{cert.title}</h4>
        <div className="cert-meta">
          <span className="cert-issuer">{cert.issuer}</span>
          {cert.year && <span className="tag cert-year">{cert.year}</span>}
        </div>
      </div>
    </div>
  );
};

/* Main Section */
const Certificates = () => {
  const { t } = useLang();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const [certs, setCerts] = useState(DEFAULT_CERTS);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        setCerts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }, () => {});
    return () => unsub();
  }, []);

  return (
    <section id="certificates" className="section certs-section">
      <div className="container">
        <div
          ref={titleRef}
          className={`section-header animate-on-scroll ${titleVisible ? 'visible' : ''}`}
        >
          <p className="section-label">— {t('certificates.subtitle')}</p>
          <h2 className="section-title">{t('certificates.title')}</h2>
        </div>

        {certs.length === 0 ? (
          <div className="empty-state">
            <span>🏆</span>
            <p>{t('certificates.no_certs')}</p>
          </div>
        ) : (
          <div className="certs-grid">
            {certs.map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert}
                index={i}
                onClick={setLightboxIndex}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          certs={certs}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
};

export default Certificates;
