import React from 'react';
import { motion } from 'framer-motion';
import TransportationForm from './components/TransportationForm';
import TropicalScene from './components/TropicalScene';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <div className="App">

      {/* ── HERO — full screen ── */}
      <section className="hero">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <TropicalScene />

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Alex & Lucia
          </motion.h1>

          <motion.div
            className="hero-title-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            Transportation
          </motion.div>

          <motion.div
            className="chip-row"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="chip">
              <svg viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="2.5" stroke="var(--teal)" strokeWidth="1.2" />
                <line x1="2" y1="7" x2="14" y2="7" stroke="var(--teal)" strokeWidth="1.2" />
                <line x1="5.5" y1="1.5" x2="5.5" y2="4.5" stroke="var(--teal)" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="10.5" y1="1.5" x2="10.5" y2="4.5" stroke="var(--teal)" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="6" cy="10" r="0.7" fill="var(--teal)" />
                <circle cx="10" cy="10" r="0.7" fill="var(--teal)" />
              </svg>
              June 13–15, 2026
            </div>
            <div className="chip">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C5 1.5 2.5 4 2.5 7C2.5 11 8 14.5 8 14.5C8 14.5 13.5 11 13.5 7C13.5 4 11 1.5 8 1.5Z" stroke="var(--green)" strokeWidth="1.2" fill="var(--green-pale)" />
                <circle cx="8" cy="7" r="2" stroke="var(--green)" strokeWidth="1.2" />
              </svg>
              Destination Wedding
            </div>
          </motion.div>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            We can't wait to celebrate with you!
          </motion.p>

          <motion.div
            className="dress-tip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <svg className="dress-tip-icon" width="18" height="18" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L8 6L4 7L6 11L4 20H18L16 11L18 7L14 6L11 2Z" stroke="var(--teal)" strokeWidth="1.2" fill="var(--teal-pale)" strokeLinejoin="round" />
              <path d="M9 6C9 6 9.5 8 11 8C12.5 8 13 6 13 6" stroke="var(--teal)" strokeWidth="0.9" strokeLinecap="round" />
              <line x1="4" y1="20" x2="18" y2="20" stroke="var(--teal)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="dress-tip-desc">Linen suits and maxi dresses — keep it breezy. Light, airy colors are preferred. We recommend bringing 2–3 outfits per person.</span>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <div className="scroll-hint">
          <span>Scroll</span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M6 8L10 12L14 8" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* Wave separator */}
      <div className="wave-sep">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path d="M0,24 C180,42 360,6 540,24 C720,42 900,6 1080,24 C1260,42 1380,12 1440,24 L1440,0 L0,0 Z" fill="var(--teal-pale)" opacity="0.3" />
          <path d="M0,28 C240,44 480,8 720,26 C960,44 1200,6 1440,26 L1440,0 L0,0 Z" fill="var(--green-pale)" opacity="0.2" />
        </svg>
      </div>

      {/* ── FORM ── */}
      <section className="form-section">
        <div className="form-container">
          <motion.div
            className="form-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <TransportationForm />
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
          <path d="M8 14C6 12 1.5 9 1.5 5.5C1.5 3 3.5 1.5 5.5 1.5C6.8 1.5 7.6 2.2 8 3C8.4 2.2 9.2 1.5 10.5 1.5C12.5 1.5 14.5 3 14.5 5.5C14.5 9 10 12 8 14Z" fill="var(--teal)" opacity="0.2" />
        </svg>
        <span className="footer-text">Alex & Lucia — June 2026</span>
        <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
          <path d="M8 14C6 12 1.5 9 1.5 5.5C1.5 3 3.5 1.5 5.5 1.5C6.8 1.5 7.6 2.2 8 3C8.4 2.2 9.2 1.5 10.5 1.5C12.5 1.5 14.5 3 14.5 5.5C14.5 9 10 12 8 14Z" fill="var(--teal)" opacity="0.2" />
        </svg>
      </footer>
    </div>
  );
}

export default App;
