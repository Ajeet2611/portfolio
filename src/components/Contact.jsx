// src/components/Contact.jsx
import { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import toast from 'react-hot-toast';
import { useLang } from '../context/LanguageContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { FiMail, FiMapPin, FiLinkedin, FiGithub, FiSend } from 'react-icons/fi';
import './Contact.css';

// ⚠️ Replace with your EmailJS credentials
// Get them at: https://www.emailjs.com/
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

const Contact = () => {
  const { t } = useLang();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: leftRef,  isVisible: leftVisible  } = useScrollAnimation();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors]     = useState({});
  const [sending, setSending]   = useState(false);

  // Validate fields
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSending(true);
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      toast.success(t('contact.success'));
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error(t('contact.error'));
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMail size={20} />,
      label: 'Email',
      value: t('contact.email_info'),
      href: `mailto:${t('contact.email_info')}`,
    },
    {
      icon: <FiMapPin size={20} />,
      label: 'Location',
      value: t('contact.location'),
      href: null,
    },
    {
      icon: <FiLinkedin size={20} />,
      label: 'LinkedIn',
      value: 'ajeet-prasad-dev',
      href: 'https://www.linkedin.com/in/ajeet-prasad-dev',
    },
    {
      icon: <FiGithub size={20} />,
      label: 'GitHub',
      value: 'Ajeet2611',
      href: 'https://github.com/Ajeet2611',
    },
  ];

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div
          ref={titleRef}
          className={`section-header animate-on-scroll ${titleVisible ? 'visible' : ''}`}
        >
          <p className="section-label">— {t('contact.subtitle')}</p>
          <h2 className="section-title">{t('contact.title')}</h2>
        </div>

        <div className="contact-grid">
          {/* Left: info cards */}
          <div
            ref={leftRef}
            className={`contact-left animate-left ${leftVisible ? 'visible' : ''}`}
          >
            <div className="contact-intro glass-card">
              <h3>Let's Build Something Together 🚀</h3>
              <p>
                Whether you have a project idea, a collaboration in mind, or just want to say hi —
                my inbox is always open!
              </p>
            </div>

            <div className="contact-info-list">
              {contactInfo.map((item) => (
                <div key={item.label} className="contact-info-item neu-card">
                  <span className="contact-info-icon">{item.icon}</span>
                  <div>
                    <p className="contact-info-label">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="contact-info-value link">
                        {item.value}
                      </a>
                    ) : (
                      <p className="contact-info-value">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div
            ref={rightRef}
            className={`contact-right animate-right ${rightVisible ? 'visible' : ''}`}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="contact-form glass-card" noValidate>
              <h3 className="form-title">Send Me a Message</h3>

              {/* Name */}
              <div className="form-group">
                <label className="form-label">{t('contact.name_label')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ajeet Prasad"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">{t('contact.email_label')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label">{t('contact.message_label')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hi Ajeet, I'd like to..."
                  rows={5}
                  className={`form-input form-textarea ${errors.message ? 'input-error' : ''}`}
                />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn-primary submit-btn" disabled={sending}>
                {sending ? (
                  <>
                    <div className="spinner" />
                    {t('contact.sending')}
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    {t('contact.send_btn')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
