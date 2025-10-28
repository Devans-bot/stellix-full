import gsap from "gsap";

// Fade in + slight scale
export const fadeIn = (element) => {
  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.2 },
    { opacity: 1, scale: 1, duration:0.6,  }
  );
};

// Fade out + slight scale
export const fadeOut = (element, callback) => {
  gsap.to(element, {
    opacity: 0,
    scale: 0.2,
    duration: 1,
    ease: "power1.in",
    onComplete: callback,
  });
};

export const slideInFromRight = (element) => {
    gsap.fromTo(
      element,
      { x: "50%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  };
  
  export const slideOutToRight = (element, onComplete) => {
    gsap.to(element, {
      x: "100%",
      opacity: 1,
      duration: 0.3,
      ease: "power3.in",
      onComplete,
    });
}
