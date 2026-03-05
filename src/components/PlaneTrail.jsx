import React from 'react';
import { motion } from 'framer-motion';

// Animated plane with a dotted trail path — flies across the hero section
const PlaneTrail = ({ className = '' }) => {
  return (
    <motion.svg
      className={`plane-trail ${className}`}
      viewBox="0 0 600 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.6 }}
      aria-hidden="true"
    >
      {/* Dotted trail path */}
      <motion.path
        d="M0 80 C80 80, 120 30, 200 40 C280 50, 320 90, 400 60 C440 45, 480 20, 540 30"
        stroke="var(--champagne)"
        strokeWidth="1.5"
        strokeDasharray="6 8"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.0, duration: 2.5, ease: "easeInOut" }}
      />

      {/* Small decorative dots along the path */}
      {[
        { cx: 100, cy: 55, delay: 1.5 },
        { cx: 200, cy: 40, delay: 1.8 },
        { cx: 300, cy: 70, delay: 2.1 },
        { cx: 400, cy: 60, delay: 2.4 },
      ].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r="2"
          fill="var(--champagne)"
          fillOpacity="0.3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: dot.delay, duration: 0.3, type: "spring" }}
        />
      ))}

      {/* Plane icon at the end of the trail */}
      <motion.g
        initial={{ x: -40, y: 20, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
      >
        <motion.g
          transform="translate(530, 22) rotate(-10)"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Plane body */}
          <path
            d="M0 8 L12 4 L22 0 L24 3 L14 6 L26 10 L14 8 L12 12 L10 8 L0 8Z"
            fill="var(--champagne)"
            fillOpacity="0.6"
          />
          {/* Small wing detail */}
          <path
            d="M8 6 L16 2"
            stroke="var(--champagne-dark)"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
        </motion.g>
      </motion.g>

      {/* Tiny heart near the plane */}
      <motion.text
        x="555"
        y="18"
        fontSize="8"
        fill="var(--champagne)"
        fillOpacity="0.35"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.4, type: "spring", stiffness: 300 }}
      >
        ♥
      </motion.text>
    </motion.svg>
  );
};

export default PlaneTrail;
