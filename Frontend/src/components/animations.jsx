// src/animations.js
export const pageVariants = {
    initial: {
      x: "100%",
      opacity: 1,
    },
    enter: {
      x: "0%",
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      x: "100%",
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };
  
  export const backgroundVariants = {
    initial: { scale: 1, x: -20 },
    enter: { scale: 1, x:0, transition: { duration: 0.5 } },
    exit: { scale: 1, x: 0, transition: { duration: 0.5 } },
  };
  