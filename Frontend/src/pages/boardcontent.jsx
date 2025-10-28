// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { Loading } from '../components/loading'

// const Boardcontent = () => {
   
//    const {boardId}=useParams()
//    const [nloading,setnloading]=useState(false)
//    const [pins,setpins]=useState([])


//    useEffect(()=>{
//     const fetchpins=async()=>{
//   try {
//         const {data}=await axios.post(`/boardpins/${boardId}`)
//         setpins(data)
//      } catch (error) {
//         console.log(error)
//      }
//     }
//    if(boardId){
//     fetchpins()
//    }
//    },[boardId,setpins])



//   return (
//     <>
//      {nloading ? <Loading/>:  <div className="bg-[#F2FAFF] mt-5 max-w-7xl hidden md:block">
     
//      <Masonry
//        breakpointCols={desktopview}
//        className="my-masonry-grid"
//        columnClassName="my-masonry-grid_column"
//      >
//        {pins.map((pin) => (
//          <Pincard key={pin._id || pin.id} pin={pin} />
//        ))}
//      </Masonry>
//    </div>}
 
 
 
//     {/*mobile view*/}
//     {nloading ? <Loading/>:  <div className="bg-[#F2FAFF] mt-5 max-w-7xl block md:hidden">
     
//      <Masonry
//        breakpointCols={mobileview}
//        className="my-masonry-grid"
//        columnClassName="my-masonry-grid_column"
//      >
//        {pins.map((pin) => (
//          <Pincard key={pin._id || pin.id} pin={pin} />
//        ))}
//      </Masonry>
//    </div>}
//     </>
//    )
// }

// export default Boardcontent


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { Loading } from '../components/loading';
import Pincard from '../components/pincard';
import BackButton from '../components/backbutton';

const Boardcontent = () => {
  const { boardId } = useParams();
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState([]);

  const desktopview = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };


  const mobileview = {
    default: 1,
    640: 2,
    768: 3,
    1024: 4
  }

  useEffect(() => {
    const fetchPins = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(`/api/boards/boardpins/${boardId}`); // ✅ Use GET
        setPins(data.pins|| []); // ✅ Ensure pins array
        
      } catch (error) {
        console.error('Error fetching pins:', error);
      } finally {
        setLoading(false);
      }
    };

  if(boardId){
          fetchPins();

  }
    
  }, [boardId]);

  if (loading) {
    return <Loading />;
  }


  return (
    <>
      {/* Desktop View */}
      <div className="bg-[#F2FAFF] mt-5 max-w-7xl hidden md:block">
        <Masonry
          breakpointCols={desktopview}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {pins.length > 0 ? (
            pins.map((pin,index) => <Pincard key={pin._id || index} pin={pin} />)
          ) : (
            <p className="text-center w-full">No pins in this board</p>
          )}
        </Masonry>
      </div>

      {/* Mobile View */}
      <div className="bg-[#F2FAFF] mt-5 max-w-7xl block md:hidden">
        <BackButton/>
        <Masonry
          breakpointCols={mobileview}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {pins.length > 0 ? (
            pins.map((pin,index) => <Pincard key={pin._id || index} pin={pin} />)
          ) : (
            <p className="text-center w-full">No pins in this board</p>
          )}
        </Masonry>
      </div>
    </>
  );
};

export default Boardcontent;
