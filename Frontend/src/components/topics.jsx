import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Pindata } from '../context/pincontext';
import logo from "../assets/S-o.png";
import gsap from 'gsap';

const Topics = () => {
  const { filter, setfilter } = Pindata();
  const containerRefDesktop = useRef(null);
  const bgRefDesktop = useRef(null);
  const buttonRefsDesktop = useRef([]);
  
  const containerRefMobile = useRef(null);
  const bgRefMobile = useRef(null);
  const buttonRefsMobile = useRef([]);
  

  // Animate sliding background
  useEffect(() => {
    const isMobile = window.innerWidth < 768; // Tailwind md breakpoint
    const bg = isMobile ? bgRefMobile.current : bgRefDesktop.current;
    const buttons = isMobile ? buttonRefsMobile.current : buttonRefsDesktop.current;
  
    const activeBtn = buttons.find(btn => btn?.dataset.filter === filter);
    if (activeBtn && bg) {
      gsap.to(bg, {
        x: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        duration: 0.4,
        ease: "power3.out"
      });
    }
  }, [filter]);
  

  const handleReload = () => window.location.reload();

  return (
   <>

   
    {/* Desktop Nav */}
<div className="hidden md:block">
  <nav className="h-14 w-full rounded-b-xl  bg-black/90 backdrop-blur-xl">
    <div className="flex relative left-4/11">
      <div ref={containerRefDesktop} className="relative mt-4  flex gap-2">
        <span
          ref={bgRefDesktop}
          className="absolute top-0 left-0 p-4 bg-blue-600 rounded-2xl z-0"
          style={{ width: buttonRefsDesktop.current[0]?.offsetWidth || 0 }}
        ></span>

        <button
          ref={(el) => (buttonRefsDesktop.current[0] = el)}
          data-filter="all"
          className="relative z-10 text-white px-3 py-1 rounded-2xl"
          onClick={() => setfilter("all")}
        >
          For you
        </button>
        <button
          ref={(el) => (buttonRefsDesktop.current[1] = el)}
          data-filter="following"
          className="relative z-10 text-white px-3 py-1 rounded-2xl"
          onClick={() => setfilter("following")}
        >
          Following
        </button>
      </div>
    </div>
  </nav>
</div>

{/* Mobile Nav */}<div className="block md:hidden">
  <nav className="h-18 w-screen  rounded-b-xl bg-[black]/90 backdrop-blur-xl fixed top-0 right-0 z-50">
    <div className="relative flex items-center justify-center mt-3">
      {/* Left-aligned logo */}
      <Link to="/" className="absolute left-4">
        <img src={logo} onClick={handleReload} alt="logo" className="h-8" />
      </Link>

      {/* Centered buttons container */}
      <div
        ref={containerRefMobile}
        className="relative flex gap-2 justify-center items-center"
      >
        <span
          ref={bgRefMobile}
          className="absolute top-0 left-0 p-4 bg-blue-500 rounded-2xl z-0 transition-all duration-300"
          style={{ width: buttonRefsMobile.current[0]?.offsetWidth || 0 }}
        ></span>

        <button
          ref={(el) => (buttonRefsMobile.current[0] = el)}
          data-filter="all"
          className="relative z-10 text-white px-3 py-1 rounded-2xl"
          onClick={() => setfilter("all")}
        >
          For you
        </button>

        <button
          ref={(el) => (buttonRefsMobile.current[1] = el)}
          data-filter="following"
          className="relative z-10 text-white px-3 py-1 rounded-2xl"
          onClick={() => setfilter("following")}
        >
          Following
        </button>
      </div>
    </div>
  </nav>
</div>


   </>








  
  );
};

export default Topics;
