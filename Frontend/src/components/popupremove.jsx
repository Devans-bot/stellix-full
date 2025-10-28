// import { useEffect } from "react";

// export default function useOutsideClick(ref, onClose) {
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         if (typeof onClose === "function") {
//             onClose();   // ✅ only call if it's really a function
//           }
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("touchstart", handleClickOutside); // mobile taps

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("touchstart", handleClickOutside);
//     };
//   }, [ref, onClose]);
// }
            

import { useEffect } from "react";
import { gsap } from "gsap";

export default function useOutsideClick(ref, onClose) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (typeof onClose === "function") {
          // Animate out first
          gsap.to(ref.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
              onClose(); // then unmount/remove
            }
          });
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // mobile taps

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ onClose]);
}
