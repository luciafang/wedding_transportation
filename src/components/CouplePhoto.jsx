import React from 'react';
import { motion } from 'framer-motion';

/**
 * CouplePhoto — circular photo with sage→blush gradient border.
 * Shows "A&L" placeholder if no src.
 */
const CouplePhoto = ({ src }) => {
  const size = 88;
  const borderWidth = 3;

  return (
    <motion.div
      className="couple-photo-wrapper"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6BB894, #E8917A)',
          padding: borderWidth,
          margin: '0 auto',
        }}
      >
        {src ? (
          <img
            src={src}
            alt="Couple"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.2rem',
              color: '#5AA377',
              fontWeight: 500,
            }}
          >
            A&L
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CouplePhoto;
