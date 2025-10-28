import React, { useRef, useState } from 'react';
import { GoShare } from "react-icons/go";

import { FiShare2 } from 'react-icons/fi';
import useOutsideClick from './popupremove';

const PinShare = ({ pinUrl }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const popupref=useRef()

  useOutsideClick(popupref,()=>setShowPopup(false))

  const handleCopy = () => {
    console.log("Copying this URL:", pinUrl);
    if (!pinUrl) {
      alert("URL is undefined or empty!");
      return;
    }
    navigator.clipboard.writeText(pinUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
      })
      .catch(() => {
        alert("Failed to copy");
      });
  };

  const toggleshowPopup=()=>{
        setShowPopup(true)
  }
  

  return (
    <div  style={{ position: 'relative', display: 'inline-block' }}>
      
      
      <button
        onClick={toggleshowPopup}
        className="p-2 z-50 bg-[white] rounded-full shadow-lg hover:bg-gray-700 transition"
    >
      <GoShare className='size-5 text-black' />
    </button>

      {showPopup && (
        <div
        ref={popupref}
          style={{
            position: 'absolute',
            top: '2.5rem',
            right: 0,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            width: '220px',
            zIndex: 100,
          }}
        >
          <p className='text-black' style={{ fontSize: '0.9rem', marginBottom: '8px', wordBreak: 'break-all' }}>
            {pinUrl}
          </p>
          <button
            onClick={handleCopy}
            style={{
              backgroundColor: copied ? '#4caf50' : '#007bff',
              border: 'none',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PinShare;
