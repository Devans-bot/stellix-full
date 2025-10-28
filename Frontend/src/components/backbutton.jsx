import { useNavigate } from "react-router-dom";
import { TiArrowLeftOutline } from "react-icons/ti";
import React from "react";
import gsap from "gsap";

const BackButton = ({ pageRef }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (pageRef?.current) {
      // Animate shrink + fade
      gsap.to(pageRef.current, {
        scale: 0.8,       // shrink
        opacity: 0,       // fade out
        duration: 0.5,
        ease: "power2.inOut",
        transformOrigin: "center center", // scale from center
        onComplete: () => navigate(-1),   // navigate only after animation
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
    <button
      onClick={handleBack}
      className=" hidden md:block  fixed top-30 left-13 z-50 bg-[#2C2C32] rounded-full p-4 shadow-lg hover:bg-gray-700 transition"
    >
      <TiArrowLeftOutline className="text-white" size={20} />
    </button>




    
    <button
      onClick={handleBack}
      className="block md:hidden fixed top-3 left-5 z-50 bg-[#2C2C32] rounded-full p-2 shadow-lg hover:bg-gray-700 transition"
      >
      <TiArrowLeftOutline className="text-white" size={20} />
    </button>
    </>
  );
};

export default BackButton;
