// frontend/src/components/common/AnimatedSection.js
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({ children, className }) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 75 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        // --- THIS IS THE FIX ---
        // Framer Motion expects a string for cubic-bezier, not an array.
        // We can use a predefined string like "easeOut" which is simpler and effective.
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      className={`section ${className || ''}`}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;