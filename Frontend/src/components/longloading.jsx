import React, { useEffect, useState } from "react";

const LongLoading = ({ duration = 12000 }) => { // simulate loading duration
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Show "loading is long" message after 9 seconds
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 9000);

    // Finish loading after `duration`

   
  }, [duration]);


  return (
    
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white">
      {/* Spinner */}
      <div className="h-16 w-16 rounded-full border-4 border-blue-400 border-t-pink-400 animate-spin mb-4 shadow-[0_0_10px_rgba(255,255,255,0.5),0_0_20px_rgba(255,0,255,0.5)]"></div>

      <p className="text-lg">Loading...</p>

      {showMessage && (
        <p className="text-sm text-yellow-300 mt-2">
          Loading is taking longer than usual...
        </p>
      )}
    </div>
  );
};

export default LongLoading;
