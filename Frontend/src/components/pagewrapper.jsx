// components/PageWrapper.js
import { motion } from "framer-motion";
import { pageVariants } from "./animations";
import React from "react";

export default function PageWrapper({ children, className = "" }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
