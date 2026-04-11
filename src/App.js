import React from 'react';
import { motion } from 'framer-motion';
import TransportationForm from './components/TransportationForm';
import TropicalScene from './components/TropicalScene';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <div className="App">

      <section className="hero">
        <div className="hero-inner">
          <TropicalScene />

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Alex <span className="amp">&</span> Lucia
          </motion.h1>

          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Guest Transportation
          </motion.p>

          <motion.p
            className="hero-date"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            June 13–15, 2026 &middot; Bali, Indonesia
          </motion.p>

          <motion.div
            className="hero-dresscode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Dress code: linen suits &amp; maxi dresses — keep it breezy.<br />
            Light, airy colors preferred. We recommend 2–3 outfits per person.
          </motion.div>
        </div>
      </section>

      <section className="form-section">
        <div className="form-wrapper">
          <TransportationForm />
        </div>
      </section>

      <footer className="site-footer">
        Alex &amp; Lucia &middot; June 2026
      </footer>
    </div>
  );
}

export default App;
