// PinPageSkeleton.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const PinPageSkeleton = () => {
  const skeletonRef = useRef(null);

  useEffect(() => {
    if (skeletonRef.current) {
      const children = skeletonRef.current.children;

      // Animate the whole skeleton container (fade + slide)
      gsap.fromTo(
        skeletonRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      // Stagger animation for each skeleton block (pulse scale effect)
      gsap.fromTo(
        children,
        { scale: 0.95, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
    }
  }, []);

  return (
    <div
      ref={skeletonRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black p-4 overflow-auto"
    >
      {/* Top Image Skeleton */}
      <div className="w-full h-64 bg-gray-500 rounded-lg mb-4 animate-pulse"></div>

      {/* Title Skeleton */}
      <div className="w-3/4 h-6 bg-gray-500 rounded mb-2 animate-pulse"></div>

      {/* Description Skeleton */}
      <div className="w-full h-3 bg-gray-500 rounded mb-1 animate-pulse"></div>
      <div className="w-full h-3 bg-gray-500 rounded mb-1 animate-pulse"></div>
      <div className="w-2/3 h-3 bg-gray-500 rounded mb-4 animate-pulse"></div>

      {/* Comments Skeleton */}
      <div className="w-full h-10 bg-gray-500 rounded mb-2 animate-pulse"></div>
      <div className="w-full h-10 bg-gray-500 rounded mb-2 animate-pulse"></div>
      <div className="w-3/4 h-10 bg-gray-500 rounded animate-pulse"></div>
    </div>
  );
};

export default PinPageSkeleton;
