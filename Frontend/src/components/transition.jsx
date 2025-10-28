import { motion } from "framer-motion";
import React from "react";
import { useLocation } from "react-router-dom";

/**
 * Wraps a page and animates it from the clicked card position/size
 * Props:
 * - children: the page content
 */
const ZoomFromCardTransition = ({ children }) => {
  const location = useLocation();
  const cardRect = location.state?.cardRect || { x: 0, y: 0, width: 0, height: 0 };

  // Convert card coordinates to scale and position
  const x = cardRect.x;
  const y = cardRect.y;
  const scaleX = cardRect.width / window.innerWidth;
  const scaleY = cardRect.height / window.innerHeight;

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full z-50 bg-white"
      initial={{
        x,
        y,
        scaleX:1,
        scaleY,
        opacity: 0,
      }}
      animate={{
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
      }}
      exit={{
        x,
        y,
        scaleX,
        scaleY,
        opacity: 0,
      }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ZoomFromCardTransition;
