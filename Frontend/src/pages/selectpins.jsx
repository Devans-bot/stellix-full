import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Pincard from '../components/selectpincard';
import { Loading, Loadinganimation } from '../components/loading';
import BackButton from '../components/backbutton';
import { boarddata } from '../context/boardcontext';

const mobileview = {
  default: 1,
  640: 2,
  768: 3,
  1024: 4
};


const desktopview = {
  default: 5,
  1400: 5,
  1200: 4,
  992: 3,
  700: 2,
  480: 1,
};

const Selectpins = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = location.state || {};
  const {addPinsToBoard}=boarddata()
  const [rpins, setrpins] = useState([]);
  const [nloading, setnloading] = useState(false);
  const [selectedPins, setSelectedPins] = useState([]);
  const {boardId}=useParams()


  useEffect(() => {
    const fetchPins = async () => {
      if (!name) return;
      try {
        setnloading(true);
        const { data } = await axios.post('/api/boards/relatedpinsinboard', {name});
        setrpins(data.pins || []);
      } catch (error) {
        console.error('Error fetching pins:', error);
      } finally {
        setnloading(false);
      }
    };
    fetchPins();
  }, [name]);

  // ✅ Toggle pin selection
  const toggleSelect = (pinId) => {
    setSelectedPins((prev) =>
      prev.includes(pinId)
        ? prev.filter((id) => id !== pinId)
        : [...prev, pinId]
    );
  };

  // ✅ Submit selected pins to backend
  const submitPins = async () => {
    if (selectedPins.length === 0) return;

    const result = await addPinsToBoard(name, selectedPins);
      navigate(`/account`);
    if (result) {
      alert("Pins added successfully!");
      setSelectedPins([]);
    }
  
  };

  return (
    <>
 
        <div className="bg-black pt-10 max-w-7xl  h-screen hidden md:block relative  pl-10 z-40 ">

          {/* ✅ Floating Submit Button (Visible only when pins are selected) */}
          {selectedPins.length > 0 && (
            <button
              onClick={submitPins}
              className="fixed top-8 right-40 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition z-[9999]"
            >
              Submit ({selectedPins.length})
            </button>
          )}

        
        <div className='relative left-1/11 top-1/12'>
        
       
        <Masonry
            breakpointCols={desktopview}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            <BackButton/>
            {rpins.map((pin) => (
              <Pincard
                key={pin._id}
                pin={pin}
                isSelected={selectedPins.includes(pin._id)}
                onSelect={() => toggleSelect(pin._id)}
              />
            ))}
          </Masonry>

        </div>
          {rpins.length === 0 && !nloading && (
            <p className="text-center mt-5">No pins found for this board</p>
          )}
        </div>
      


      
        <div className="bg-black pl-3 pt-15 max-w-2xl h-screen block md:hidden relative">
          <BackButton />

          {/* ✅ Floating Submit Button (Visible only when pins are selected) */}
          {selectedPins.length > 0 && (
            <button
              onClick={submitPins}
              className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition z-[9999]"
            >
              Submit ({selectedPins.length})
            </button>
          )}

          <Masonry
            breakpointCols={mobileview}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {rpins.map((pin) => (
              <Pincard
                key={pin._id}
                pin={pin}
                isSelected={selectedPins.includes(pin._id)}
                onSelect={() => toggleSelect(pin._id)}
              />
            ))}
          </Masonry>

          {rpins.length === 0 && !nloading && (
            <p className="text-center mt-5">No pins found for this board</p>
          )}
        </div>
      
    </>
  );
};

export default Selectpins;
