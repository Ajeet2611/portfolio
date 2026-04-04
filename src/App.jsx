// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Components
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Skills       from './components/Skills';
import Projects     from './components/Projects';
import Certificates from './components/Certificates';
import Contact      from './components/Contact';
import Footer       from './components/Footer';

// Pages
import Login      from './pages/Login';
import AdminPanel from './pages/AdminPanel';

/* ---- Protected Route wrapper ---- */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

/* ---- Main Portfolio Page ---- */
const PortfolioPage = () => (
  <>
    {/* Background decoration */}
    <div className="bg-noise"   aria-hidden="true" />
    <div className="orb orb-1" aria-hidden="true" />
    <div className="orb orb-2" aria-hidden="true" />

    <Navbar />
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certificates />
      <Contact />
    </main>
    <Footer />
  </>
);

/* ---- App Root ---- */
const App = () => {
  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-secondary)',
            color:      'var(--text-primary)',
            border:     '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize:   '0.9rem',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        <Route path="/"      element={<PortfolioPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
