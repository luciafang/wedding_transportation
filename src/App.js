import React from 'react';
import { motion } from 'framer-motion';
import TransportationForm from './components/TransportationForm';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            ✈️ Alex & Lucia's Wedding Transportation
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Looking forward to seeing you in June!
          </motion.p>
        </motion.div>
      </section>

      <section className="form-section">
        <div className="form-container">
          <motion.div 
            className="form-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <TransportationForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default App;
