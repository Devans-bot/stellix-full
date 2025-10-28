import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Pincard = ({ pin, index }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  useEffect(() => {
    const refs = [desktopRef.current, mobileRef.current].filter(Boolean); // only animate the one rendered
    refs.forEach((ref) => {
      gsap.fromTo(
        ref,
        { y: 200, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: index * 0.1,
        }
      );
    });
  }, [index]);

  const handleClick = (e) => {
    e.preventDefault();

    const activeRef = window.innerWidth >= 768 ? desktopRef.current : mobileRef.current;

    gsap.to(activeRef, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });

    setTimeout(() => {
      navigate(`/pin/${pin._id}`, {
        state: { background: location, pinPreview: pin },
      });
    }, 200);
  };

  return (
    <>
      {/* Mobile version */}
      <div
        ref={mobileRef}
        className="block md:hidden break-inside-avoid my-4 mr-13 w-full"
      >
        <a
          href={`/pin/${pin._id}`}
          onClick={handleClick}
          className="block rounded overflow-hidden shadow"
        >
          <img
            src={pin?.image?.url || '/placeholder.png'}
            alt={pin?.title || 'Pin image'}
            className="w-full object-cover rounded "
          />
        </a>
      </div>

      {/* Desktop version */}
      <div
        ref={desktopRef}
        className="hidden md:block break-inside-avoid my-4 mr-13 w-full"
      >
        <a
          href={`/pin/${pin._id}`}
          onClick={handleClick}
          className="block rounded overflow-hidden shadow"
        >
          <img
            src={pin?.image?.url || '/placeholder.png'}
            alt={pin?.title || 'Pin image'}
            className="w-full object-cover rounded hover:scale-120  tranition duration-300"
          />
        </a>
      </div>
    </>
  );
};

export default Pincard;
