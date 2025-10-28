// ProfilePreviewCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePreviewCard = ({ title, redirect }) => {
  const [pins, setPins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const { data } = await axios.get("/api/pins/getmypin"); // 👈 fetch user pins
        // randomly pick 3
        const randomPins = data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setPins(randomPins);
      } catch (err) {
        console.error("Error loading pins", err);
      }
    };

    fetchPins();
  }, []);

  const [Pressed,setPressed]=useState(false)

  return (

    <>
     <div
      className="text-white relative left-3/12 w-3xl hidden md:block mt-5 rounded-xl shadow-md p-2 cursor-pointer hover:scale-95 transition bg-[#0F0E15]"
      onClick={() => navigate(redirect)}
    >
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <div className="grid grid-cols-3 w-full  /rounded-2xl  gap-2">
        {pins.map((pin) => (
          <img
            key={pin._id}
            src={pin.image.url}
            alt={pin.title}
            className="w-full h-7/12  object-cover rounded-lg"
          />
        ))}
        {pins.length === 0 && (
          <p className="col-span-3 text-gray-500 text-sm">No pins yet</p>
        )}
      </div>
    </div>



    
    
    
    
    
    
    
    
    
    <div
      className="text-white block md:hidden mt-5 rounded-xl shadow-md p-2 cursor-pointer active:scale-95 transition"

      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{ transform: Pressed ? "scale(0.95)" : undefined }}

      onClick={() => navigate(redirect)}
    >
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <div className="grid grid-cols-3  rounded-2xl  b gap-2">
        {pins.map((pin) => (
          <img
            key={pin._id}
            src={pin.image.url}
            alt={pin.title}
            className="w-full h-20 object-cover rounded-lg"
          />
        ))}
        {pins.length === 0 && (
          <p className="col-span-3 text-gray-500 text-sm">No pins yet</p>
        )}
      </div>
    </div>
    </>


    
   
  );
};

export default ProfilePreviewCard;
