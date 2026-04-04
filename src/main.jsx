// src/main.jsx
import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Contexts
import { ThemeProvider }    from './context/ThemeContext';
import { AuthProvider }     from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Preloader from './components/Preloader';
import App       from './App';

// Global styles
import './index.css';

/* ---- Root with Preloader ---- */
const Root = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      {!loading && <App />}
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <Root />
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
