// src/components/Projects.jsx
import { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useLang } from '../context/LanguageContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { FiGithub, FiExternalLink, FiFileText, FiVideo, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Projects.css';

// Default/demo projects
const DEFAULT_PROJECTS = [
  {
    id: 'demo1',
    title: 'Portfolio Website',
    description: 'Personal portfolio with React, Firebase, dark/light mode and multi-language support.',
    techStack: ['React', 'Firebase', 'CSS3'],
    githubLink: 'https://github.com/Ajeet2611',
    demoLink: '',
    images: [],
    featured: true,
  },
  {
    id: 'demo2',
    title: 'Flutter App Project',
    description: 'A Flutter mobile application with Firebase backend, authentication and real-time database.',
    techStack: ['Flutter', 'Firebase', 'Dart'],
    githubLink: 'https://github.com/Ajeet2611',
    demoLink: '',
    images: [],
  },
];

/* ---- Image Slider inside a project modal ---- */
const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div className="modal-img-placeholder">
        <span>🖼️</span>
        <p>No images uploaded</p>
      </div>
    );
  }
  return (
    <div className="modal-slider">
      <img src={images[current]} alt={`slide-${current}`} className="modal-slide-img" />
      {images.length > 1 && (
        <>
          <button className="slide-btn slide-prev" onClick={() => setCurrent(p => (p - 1 + images.length) % images.length)}>
            <FiChevronLeft />
          </button>
          <button className="slide-btn slide-next" onClick={() => setCurrent(p => (p + 1) % images.length)}>
            <FiChevronRight />
          </button>
          <div className="slide-dots">
            {images.map((_, i) => (
              <button key={i} className={`slide-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ---- Project Detail Modal ---- */
const ProjectModal = ({ project, onClose }) => {
  const { t } = useLang();
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX size={20} /></button>

        <ImageSlider images={project.images} />

        <div className="modal-body">
          <h2 className="modal-title">{project.title}</h2>
          {project.featured && <span className="tag featured-tag">⭐ Featured</span>}
          <p className="modal-desc">{project.description}</p>

          {/* Tech Stack */}
          <div className="modal-section">
            <h4>{t('projects.tech_stack')}</h4>
            <div className="modal-tags">
              {(project.techStack || []).map(tech => (
                <span key={tech} className="tag">{tech}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="modal-links">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <FiGithub size={16} /> {t('projects.view_github')}
              </a>
            )}
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <FiExternalLink size={16} /> {t('projects.view_demo')}
              </a>
            )}
            {project.pptLink && (
              <a href={project.pptLink} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <FiFileText size={16} /> {t('projects.view_ppt')}
              </a>
            )}
            {project.videoLink && (
              <a href={project.videoLink} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <FiVideo size={16} /> Watch Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---- Project Card ---- */
const ProjectCard = ({ project, index, onClick }) => {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useLang();

  return (
    <div
      ref={ref}
      className={`project-card glass-card animate-on-scroll ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onClick={() => onClick(project)}
    >
      {/* Card image / placeholder */}
      <div className="project-thumb">
        {project.images?.[0] ? (
          <img src={project.images[0]} alt={project.title} />
        ) : (
          <div className="project-thumb-placeholder">
            <span>💻</span>
          </div>
        )}
        {project.featured && <span className="featured-badge">⭐ Featured</span>}
        <div className="project-overlay">
          <span className="view-label">View Details</span>
        </div>
      </div>

      {/* Card body */}
      <div className="project-body">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        {/* Tech stack tags */}
        <div className="project-tags">
          {(project.techStack || []).slice(0, 3).map(tech => (
            <span key={tech} className="tag">{tech}</span>
          ))}
          {project.techStack?.length > 3 && (
            <span className="tag">+{project.techStack.length - 3}</span>
          )}
        </div>

        {/* Quick links */}
        <div className="project-links" onClick={e => e.stopPropagation()}>
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link-btn" title="GitHub">
              <FiGithub size={16} />
            </a>
          )}
          {project.demoLink && (
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link-btn" title="Live Demo">
              <FiExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---- Main Projects Section ---- */
const Projects = () => {
  const { t } = useLang();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }, () => {});
    return () => unsub();
  }, []);

  // Collect all unique tech stack items for filter
  const allTechs = ['All', ...new Set(projects.flatMap(p => p.techStack || []))];

  const filtered = filter === 'All' ? projects : projects.filter(p => p.techStack?.includes(filter));

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div
          ref={titleRef}
          className={`section-header animate-on-scroll ${titleVisible ? 'visible' : ''}`}
        >
          <p className="section-label">— {t('projects.subtitle')}</p>
          <h2 className="section-title">{t('projects.title')}</h2>
        </div>

        {/* Tech filter */}
        <div className="skill-filters">
          {allTechs.slice(0, 8).map(tech => (
            <button
              key={tech}
              className={`filter-btn ${filter === tech ? 'active' : ''}`}
              onClick={() => setFilter(tech)}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span>🚀</span>
            <p>{t('projects.no_projects')}</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onClick={setSelectedProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default Projects;
