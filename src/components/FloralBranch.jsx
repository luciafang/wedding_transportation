import React from 'react';
import { motion } from 'framer-motion';

// Elegant botanical branch SVG — delicate leaves with small flower buds
// Used as decorative accents on left and right sides of the hero
const FloralBranch = ({ side = 'left', className = '' }) => {
  const isLeft = side === 'left';

  return (
    <motion.svg
      className={`floral-branch floral-branch--${side} ${className}`}
      viewBox="0 0 120 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
      style={{ transform: isLeft ? 'scaleX(1)' : 'scaleX(-1)' }}
      aria-hidden="true"
    >
      {/* Main stem */}
      <motion.path
        d="M60 280 C60 240, 55 200, 58 160 C61 120, 56 80, 60 40"
        stroke="var(--champagne)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
      />

      {/* Leaf pairs — gently growing in */}
      {[
        { d: "M58 240 C45 235, 30 228, 22 220 C30 222, 42 228, 58 238", delay: 1.2 },
        { d: "M60 220 C72 212, 85 208, 95 200 C87 206, 74 212, 60 218", delay: 1.4 },
        { d: "M58 195 C44 188, 30 180, 20 172 C30 178, 42 184, 58 193", delay: 1.6 },
        { d: "M60 175 C74 168, 88 162, 98 155 C88 160, 76 166, 60 173", delay: 1.8 },
        { d: "M58 150 C46 144, 34 136, 26 128 C34 134, 46 140, 58 148", delay: 2.0 },
        { d: "M60 130 C72 124, 84 118, 92 112 C84 116, 74 122, 60 128", delay: 2.2 },
        { d: "M58 108 C48 102, 38 94, 32 86 C38 92, 48 98, 58 106", delay: 2.4 },
        { d: "M60 88 C70 82, 80 76, 86 70 C80 74, 72 80, 60 86", delay: 2.6 },
      ].map((leaf, i) => (
        <motion.path
          key={i}
          d={leaf.d}
          fill="var(--champagne)"
          fillOpacity="0.3"
          stroke="var(--champagne)"
          strokeWidth="0.8"
          strokeOpacity="0.5"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: leaf.delay, duration: 0.5, ease: "easeOut" }}
        />
      ))}

      {/* Small flower buds */}
      {[
        { cx: 22, cy: 220, delay: 2.0 },
        { cx: 98, cy: 155, delay: 2.3 },
        { cx: 60, cy: 40, delay: 2.8 },
      ].map((bud, i) => (
        <motion.g key={`bud-${i}`}>
          <motion.circle
            cx={bud.cx}
            cy={bud.cy}
            r="3.5"
            fill="var(--champagne)"
            fillOpacity="0.35"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: bud.delay, duration: 0.4, type: "spring", stiffness: 300 }}
          />
          {/* Tiny petals */}
          {[0, 72, 144, 216, 288].map((angle) => (
            <motion.ellipse
              key={angle}
              cx={bud.cx + Math.cos((angle * Math.PI) / 180) * 5}
              cy={bud.cy + Math.sin((angle * Math.PI) / 180) * 5}
              rx="2"
              ry="3.5"
              fill="var(--champagne)"
              fillOpacity="0.2"
              transform={`rotate(${angle}, ${bud.cx + Math.cos((angle * Math.PI) / 180) * 5}, ${bud.cy + Math.sin((angle * Math.PI) / 180) * 5})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: bud.delay + 0.15, duration: 0.3, ease: "easeOut" }}
            />
          ))}
        </motion.g>
      ))}

      {/* Gentle sway animation on leaves */}
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="-1 60 280; 1 60 280; -1 60 280"
        dur="6s"
        repeatCount="indefinite"
        additive="sum"
      />
    </motion.svg>
  );
};

export default FloralBranch;
