import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.98
  }
};

// Opciones de transición personalizadas
const pageTransition = {
  duration: 0.6,
  ease: [0.43, 0.13, 0.23, 0.96]
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;