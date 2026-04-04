// src/components/Preloader.jsx
import { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onFinish, 600);
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className={`preloader ${fadeOut ? 'fade-out' : ''}`}>
      {/* Animated background orbs */}
      <div className="preloader-orb preloader-orb-1" />
      <div className="preloader-orb preloader-orb-2" />

      <div className="preloader-content">
        {/* Logo / Initials */}
        <div className="preloader-logo">
          <span className="logo-ap">AP</span>
          <div className="logo-ring" />
        </div>

        {/* Name */}
        <h1 className="preloader-name">Ajeet Prasad</h1>
        <p className="preloader-tagline">Crafting Digital Experiences</p>

        {/* Progress bar */}
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className="progress-number">{Math.min(Math.round(progress), 100)}%</span>
      </div>
    </div>
  );
};

export default Preloader;
