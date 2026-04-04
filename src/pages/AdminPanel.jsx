// src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import {
  FiLogOut, FiPlus, FiTrash2, FiEdit2, FiSave, FiX,
  FiUpload, FiAward, FiCode, FiBriefcase, FiHome
} from 'react-icons/fi';
import './AdminPanel.css';

/* ===================== HELPERS ===================== */

/** Upload a file to Firebase Storage and return download URL */
const uploadFile = async (file, path, onProgress) => {
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);
  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      snap => onProgress && onProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
};

/* ===================== SKILLS TAB ===================== */
const SkillsTab = () => {
  const { t } = useLang();
  const [skills, setSkills]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({ name: '', level: 70, category: 'Language', icon: '💡' });

  useEffect(() => {
    const q = query(collection(db, 'skills'), orderBy('level', 'desc'));
    const unsub = onSnapshot(q, snap => setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const resetForm = () => {
    setForm({ name: '', level: 70, category: 'Language', icon: '💡' });
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Skill name is required'); return; }
    try {
      if (editing) {
        await updateDoc(doc(db, 'skills', editing), form);
        toast.success('Skill updated!');
      } else {
        await addDoc(collection(db, 'skills'), { ...form, level: Number(form.level) });
        toast.success('Skill added!');
      }
      resetForm();
    } catch (e) {
      toast.error('Error: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await deleteDoc(doc(db, 'skills', id));
      toast.success('Skill deleted');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleEdit = (skill) => {
    setEditing(skill.id);
    setForm({ name: skill.name, level: skill.level, category: skill.category, icon: skill.icon || '💡' });
  };

  const CATEGORIES = ['Language', 'Framework', 'Backend', 'Database', 'CS Fundamentals', 'Tools'];

  return (
    <div className="admin-tab">
      {/* Add / Edit form */}
      <div className="admin-form-card glass-card">
        <h3>{editing ? '✏️ Edit Skill' : `➕ ${t('admin.add_skill')}`}</h3>
        <div className="admin-form-grid">
          <div className="form-group">
            <label className="form-label">Icon (emoji)</label>
            <input className="form-input" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="💡" />
          </div>
          <div className="form-group">
            <label className="form-label">Skill Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Python" />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Level: {form.level}%</label>
            <input type="range" min={10} max={100} value={form.level} onChange={e => setForm(p => ({ ...p, level: Number(e.target.value) }))} className="range-slider" />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave}><FiSave size={14} /> {t('admin.save')}</button>
          {editing && <button className="btn-outline" onClick={resetForm}><FiX size={14} /> {t('admin.cancel')}</button>}
        </div>
      </div>

      {/* Skills list */}
      <div className="admin-list">
        {skills.map(skill => (
          <div key={skill.id} className="admin-list-item glass-card">
            <span className="skill-icon-sm">{skill.icon}</span>
            <div className="admin-item-info">
              <strong>{skill.name}</strong>
              <span className="tag">{skill.category}</span>
            </div>
            <div className="admin-item-level">
              <div className="mini-bar-track">
                <div className="mini-bar-fill" style={{ width: `${skill.level}%` }} />
              </div>
              <span className="mini-percent">{skill.level}%</span>
            </div>
            <div className="admin-item-actions">
              <button className="icon-btn edit-btn" onClick={() => handleEdit(skill)}><FiEdit2 size={15} /></button>
              <button className="icon-btn delete-btn" onClick={() => handleDelete(skill.id)}><FiTrash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===================== PROJECTS TAB ===================== */
const ProjectsTab = () => {
  const { t } = useLang();
  const [projects, setProjects] = useState([]);
  const [editing, setEditing]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({
    title: '', description: '', techStack: '', githubLink: '', demoLink: '', featured: false,
    images: [], videoLink: '', pptLink: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const resetForm = () => {
    setForm({ title: '', description: '', techStack: '', githubLink: '', demoLink: '', featured: false, images: [], videoLink: '', pptLink: '' });
    setEditing(null);
  };

  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({
      title: p.title || '', description: p.description || '',
      techStack: (p.techStack || []).join(', '),
      githubLink: p.githubLink || '', demoLink: p.demoLink || '',
      featured: p.featured || false, images: p.images || [],
      videoLink: p.videoLink || '', pptLink: p.pptLink || ''
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const url = await uploadFile(file, `projects/${Date.now()}_${file.name}`, setUploadProgress);
      urls.push(url);
    }
    setForm(p => ({ ...p, images: [...p.images, ...urls] }));
    setUploading(false);
    setUploadProgress(0);
    toast.success('Images uploaded!');
  };

  const handleFileUpload = async (e, field, folder) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, `${folder}/${Date.now()}_${file.name}`, setUploadProgress);
      setForm(p => ({ ...p, [field]: url }));
      toast.success('File uploaded!');
    } catch (err) { toast.error(err.message); }
    setUploading(false);
    setUploadProgress(0);
  };

  const removeImage = (idx) => {
    setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    const data = {
      ...form,
      techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
      updatedAt: serverTimestamp(),
    };
    if (!editing) data.createdAt = serverTimestamp();

    try {
      if (editing) {
        await updateDoc(doc(db, 'projects', editing), data);
        toast.success('Project updated!');
      } else {
        await addDoc(collection(db, 'projects'), data);
        toast.success('Project added!');
      }
      resetForm();
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await deleteDoc(doc(db, 'projects', id));
    toast.success('Project deleted');
  };

  return (
    <div className="admin-tab">
      <div className="admin-form-card glass-card">
        <h3>{editing ? '✏️ Edit Project' : `➕ ${t('admin.add_project')}`}</h3>
        <div className="admin-form-grid two-col">
          <div className="form-group full-col">
            <label className="form-label">Title *</label>
            <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Project Title" />
          </div>
          <div className="form-group full-col">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your project..." />
          </div>
          <div className="form-group">
            <label className="form-label">Tech Stack (comma-separated)</label>
            <input className="form-input" value={form.techStack} onChange={e => setForm(p => ({ ...p, techStack: e.target.value }))} placeholder="React, Firebase, Flutter" />
          </div>
          <div className="form-group">
            <label className="form-label">GitHub Link</label>
            <input className="form-input" value={form.githubLink} onChange={e => setForm(p => ({ ...p, githubLink: e.target.value }))} placeholder="https://github.com/..." />
          </div>
          <div className="form-group">
            <label className="form-label">Live Demo Link</label>
            <input className="form-input" value={form.demoLink} onChange={e => setForm(p => ({ ...p, demoLink: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
              &nbsp; Featured Project ⭐
            </label>
          </div>

          {/* Image Upload */}
          <div className="form-group full-col">
            <label className="form-label">Project Images</label>
            <label className="upload-zone">
              <FiUpload size={20} />
              <span>{uploading ? `Uploading... ${uploadProgress}%` : 'Click to upload images'}</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
            </label>
            {form.images.length > 0 && (
              <div className="image-preview-grid">
                {form.images.map((url, i) => (
                  <div key={i} className="image-preview-item">
                    <img src={url} alt={`img-${i}`} />
                    <button className="remove-img-btn" onClick={() => removeImage(i)}><FiX size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className="form-group">
            <label className="form-label">Video Demo (optional)</label>
            <label className="upload-zone small">
              <FiUpload size={16} />
              <span>Upload video</span>
              <input type="file" accept="video/*" onChange={e => handleFileUpload(e, 'videoLink', 'videos')} disabled={uploading} />
            </label>
            {form.videoLink && <p className="upload-success">✅ Video uploaded</p>}
          </div>

          {/* PPT Upload */}
          <div className="form-group">
            <label className="form-label">PPT File (optional)</label>
            <label className="upload-zone small">
              <FiUpload size={16} />
              <span>Upload PPT</span>
              <input type="file" accept=".ppt,.pptx,.pdf" onChange={e => handleFileUpload(e, 'pptLink', 'ppts')} disabled={uploading} />
            </label>
            {form.pptLink && <p className="upload-success">✅ PPT uploaded</p>}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave} disabled={uploading}><FiSave size={14} /> {t('admin.save')}</button>
          {editing && <button className="btn-outline" onClick={resetForm}><FiX size={14} /> {t('admin.cancel')}</button>}
        </div>
      </div>

      {/* Projects list */}
      <div className="admin-list">
        {projects.map(p => (
          <div key={p.id} className="admin-list-item glass-card">
            {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="admin-item-thumb" />}
            <div className="admin-item-info">
              <strong>{p.title}</strong>
              <div className="admin-item-tags">
                {(p.techStack || []).slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            {p.featured && <span className="tag" style={{ color: 'gold', borderColor: 'gold' }}>⭐ Featured</span>}
            <div className="admin-item-actions">
              <button className="icon-btn edit-btn" onClick={() => handleEdit(p)}><FiEdit2 size={15} /></button>
              <button className="icon-btn delete-btn" onClick={() => handleDelete(p.id)}><FiTrash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===================== CERTIFICATES TAB ===================== */
const CertificatesTab = () => {
  const { t } = useLang();
  const [certs, setCerts]     = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({ title: '', issuer: '', year: '', image: '' });

  useEffect(() => {
    const q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => setCerts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const resetForm = () => {
    setForm({ title: '', issuer: '', year: '', image: '' });
    setEditing(null);
  };

  const handleEdit = (c) => {
    setEditing(c.id);
    setForm({ title: c.title || '', issuer: c.issuer || '', year: c.year || '', image: c.image || '' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, `certificates/${Date.now()}_${file.name}`, setUploadProgress);
      setForm(p => ({ ...p, image: url }));
      toast.success('Image uploaded!');
    } catch (err) { toast.error(err.message); }
    setUploading(false);
    setUploadProgress(0);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    const data = { ...form, updatedAt: serverTimestamp() };
    if (!editing) data.createdAt = serverTimestamp();
    try {
      if (editing) {
        await updateDoc(doc(db, 'certificates', editing), data);
        toast.success('Certificate updated!');
      } else {
        await addDoc(collection(db, 'certificates'), data);
        toast.success('Certificate added!');
      }
      resetForm();
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this certificate?')) return;
    await deleteDoc(doc(db, 'certificates', id));
    toast.success('Certificate deleted');
  };

  return (
    <div className="admin-tab">
      <div className="admin-form-card glass-card">
        <h3>{editing ? '✏️ Edit Certificate' : `➕ ${t('admin.add_certificate')}`}</h3>
        <div className="admin-form-grid">
          <div className="form-group">
            <label className="form-label">Certificate Title *</label>
            <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Python Programming" />
          </div>
          <div className="form-group">
            <label className="form-label">Issuing Organization</label>
            <input className="form-input" value={form.issuer} onChange={e => setForm(p => ({ ...p, issuer: e.target.value }))} placeholder="e.g. Coursera, Google" />
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input className="form-input" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="2024" />
          </div>
          <div className="form-group">
            <label className="form-label">Certificate Image</label>
            <label className="upload-zone small">
              <FiUpload size={16} />
              <span>{uploading ? `${uploadProgress}%` : 'Upload image'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
            {form.image && (
              <div className="cert-preview">
                <img src={form.image} alt="preview" />
              </div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave} disabled={uploading}><FiSave size={14} /> {t('admin.save')}</button>
          {editing && <button className="btn-outline" onClick={resetForm}><FiX size={14} /> {t('admin.cancel')}</button>}
        </div>
      </div>

      <div className="admin-list">
        {certs.map(c => (
          <div key={c.id} className="admin-list-item glass-card">
            {c.image && <img src={c.image} alt={c.title} className="admin-item-thumb" />}
            <div className="admin-item-info">
              <strong>{c.title}</strong>
              <span className="tag">{c.issuer} {c.year && `· ${c.year}`}</span>
            </div>
            <div className="admin-item-actions">
              <button className="icon-btn edit-btn" onClick={() => handleEdit(c)}><FiEdit2 size={15} /></button>
              <button className="icon-btn delete-btn" onClick={() => handleDelete(c.id)}><FiTrash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===================== MAIN ADMIN PANEL ===================== */
const AdminPanel = () => {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('skills');

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const tabs = [
    { key: 'skills',       label: t('admin.skills_tab'),       icon: <FiCode size={16} /> },
    { key: 'projects',     label: t('admin.projects_tab'),     icon: <FiBriefcase size={16} /> },
    { key: 'certificates', label: t('admin.certificates_tab'), icon: <FiAward size={16} /> },
  ];

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar glass-card">
        <div className="admin-sidebar-header">
          <div className="admin-logo">🛡️</div>
          <h2>{t('admin.title')}</h2>
          <p className="admin-user-email">{user?.email}</p>
        </div>

        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`admin-nav-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-btn" onClick={() => navigate('/')}>
            <FiHome size={16} /> Back to Portfolio
          </button>
          <button className="admin-nav-btn logout-nav-btn" onClick={handleLogout}>
            <FiLogOut size={16} /> {t('admin.logout_btn')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-content-header">
          <h1 className="gradient-text">
            {tabs.find(t => t.key === activeTab)?.icon}
            {tabs.find(t => t.key === activeTab)?.label}
          </h1>
          <p>Manage your portfolio content in real-time.</p>
        </div>

        {activeTab === 'skills'       && <SkillsTab />}
        {activeTab === 'projects'     && <ProjectsTab />}
        {activeTab === 'certificates' && <CertificatesTab />}
      </main>
    </div>
  );
};

export default AdminPanel;
