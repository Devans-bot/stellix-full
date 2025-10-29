import React, { use, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pindata } from '../context/pincontext';
import { Loading } from '../components/loading';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Like from '../components/like';
import { TiArrowLeftOutline } from "react-icons/ti";

import { GoShare } from "react-icons/go";
import Relatedpins from '../components/relatedpins';
import { IoCloudDownloadOutline } from "react-icons/io5";
import PinShare from '../components/PinShare';
import { Backpack } from 'lucide-react';
import BackButton from '../components/backbutton';
import { AiTwotoneFileAdd } from "react-icons/ai";
import Addtoboard from '../components/addtoboard';
import { IoIosArrowDown } from "react-icons/io";
import { TbZoomScan } from "react-icons/tb";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import useOutsideClick from '../components/popupremove';
import { fadeIn, slideInFromRight } from '../components/gsap';
import withSlideTransition from '../components/transition';
import ZoomFromCardTransition from '../components/transition';
import { motion } from 'framer-motion';
import { pageVariants } from '../components/animations';
import { useLocation } from 'react-router-dom';

const Pinpage = ({ user }) => {

  const { state } = useLocation();
  const preview = state?.pinPreview;   
  const popupRef=useRef()
  const [deskopen,setdeskopen]=useState(false)

  const {
    loading,
    fetchpin,
    pin,
    updatepin,
    addcmmnt,
    deletecomment,
    deletePin
  } = Pindata();

  const params = useParams();
  const navigate = useNavigate();
  const mobileRef=useRef()
  const nav=useNavigate()

   useEffect(() => {
    fetchpin(params.id);
  }, [params.id]);

  useEffect(() => {
    const homeRoot = document.getElementById("home-scroll-root");
    if (window.innerWidth >= 768 && homeRoot) {
      homeRoot.style.overflow = "hidden"; // lock Home scroll
    }
    return () => {
      if (homeRoot) {
        homeRoot.style.overflow = "auto"; // restore on modal close
      }
    };
  }, []);
  
  



  const handleBack = () => {
      nav(-1);
  };
  

  const [addtoboard,setaddtoboard]=useState(false)
  const [edit, setedit] = useState(false);
  const [title, settitle] = useState('');
  const [pinvalue, setpinvalue] = useState('');
  const [enlarged,setenlarged]=useState(false)
  const [descrip,setdescrip]=useState(false)
  const [editpin,seteditpin]=useState(false)
  const[open,setopen]=useState(false)

  const menuRef=useRef()
  useOutsideClick(menuRef,()=>seteditpin(false))



  const edithandler = () => {
    settitle(pin.title);
    setpinvalue(pin.pin);
    setedit(!edit);
  };

  const updtehandler = () => {
    updatepin(pin._id, title, pinvalue, setedit);
    settitle("")
    setpinvalue("")
  };

  const deletepin = () => {
      deletePin(pin._id, navigate);
  };


  const handleOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      navigate(-1); // go back to background route
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  
  const handleDownload = async () => {
    try {
      const res = await fetch(pin?.image?.url, { mode: "cors" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: pin?.title || "image",
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  
  
  if (!pin) return null;
  const currenturl=window.location.href

  const displayPin = pin || preview;   // 👈 fallback to preview until full data

  if (!displayPin) return null;


  return (


<>
 
{ isDesktop ? 

<div ref={popupRef} className="mt-10 mb-10 scrollbar-none overflow-x-hidden shadow-2xl border-black border-1 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  hidden:md flex flex-col inset-0 w-8/12 items-start min-h-screen rounded-3xl bg-black/80 frosted-glass bz-40 ">

{/* LEFT IMAGE */}
<div className="w-3/3 rounded-2xl h-9/12 sticky  flex mt-16 items-start  justify-center p-2">
  <img
    src={pin?.image?.url || "/placeholder.png"}
    alt={pin?.title}
    className="rounded-4xl size-11/12 w-auto object-contain"
    onClick={() => setenlarged(true)}
  />
</div>

{/* RIGHT DETAILS */}
<div className="z-40 h-screen w-full scrollbar-none p-6 -mt-5 flex gap-6 relative px-18">
  
  {/* Floating Header */}
  {edit ? (
    <input
      value={title}
      onChange={(e) => settitle(e.target.value)}
      className='border px-2 py-1 rounded w-2/3 text-sm fixed top-6 left-1/3 z-50'
    />
  ) : (
    <>
    <div className='flex items-center'>
    <button
      onClick={handleBack}
      className="fixed top-3 left-5 z-50 bg-[#2C2C32] rounded-full p-2 shadow-lg hover:bg-gray-700 transition"
      >
      <TiArrowLeftOutline className="text-white" size={20} />
    </button>      <h1 className="fixed top-0 left-0 bg-[#0F0E15]/20 frosted-glass    w-3/3   p-4 text-center text-2xl font-semibold">
        {pin.title}
      </h1>
    </div>
      
    </>
  )}

  {/* Spacer so content doesn't go under header */}
  <div className="flex flex-col w-full">
    {/* Like + Share + Download */}

<div className="flex gap-7 w-full  items-center justify-between">
      <Like pin={pin} userId={user._id} />
      <div className="flex gap-6">
        <PinShare pinUrl={currenturl}/>

        <IoCloudDownloadOutline className='text-3xl' onClick={handleDownload}/>
        <div onClick={() => setaddtoboard(true)} className='w-36  bg-blue-500 rounded-3xl flex items-center justify-center text-white cursor-pointer'>
      Save
      {addtoboard && <Addtoboard onClose={() => setaddtoboard(false)} />}
    </div>

      </div>
    </div>

    {/* Edit/Dots Menu */}
   
   

    {/* Save to board */}
   
    {/* Description */}
    {edit ? (
      <input
        value={pinvalue}
        onChange={(e) => setpinvalue(e.target.value)}
        className='border px-2 py-1 rounded w-full text-sm mb-2 mt-4'
      />
    ) : (
      <p className='mt-10 text-gray-500 mb-8'>{pin.pin}</p>
    )}

    {edit && (
      <button
        onClick={updtehandler}
        className='absolute right-6 top-20  text-white px-2 py-1 rounded'
      >
        Save
      </button>
    )}


    {/* Owner info */}
    {pin.owner && (
      <div className='flex gap-4 items-center w-full bg-blue-200gap-4 mt-6 pb-3 mb-3'>
        <Link to={`/user/${pin.owner._id}`}>
          <div className='rounded-full w-11 h-11 bg-gray-300 flex items-center justify-center text-sm font-bold'>
            {pin.owner.image && pin.owner.image.url  ? (
              <img
                src={pin.owner.image.url }
                alt={user.name || 'profile'}
                className="w-full h-full object-cover rounded-full"
                style={{ objectPosition: 'top center' }}
              />
            ) : (
              <span className="text-5xl text-gray-700">{user.name?.charAt(0)}</span>
            )}
          </div>
        </Link>
        <div>
          <h2 className='text-sm font-semibold'>{pin.owner.name}</h2>
          <p className='text-xs text-gray-500'>{pin.owner.followers.length} Followers</p>
        </div>
      </div>
    )}

    <div className='w-full relative flex items-center justify-center'>
          <Relatedpins pinId={pin._id} />

    </div>
    {/* Related Pins */}
  </div>
  
</div>

{/* Enlarged Image Modal */}
{enlarged && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
    onClick={() => setenlarged(false)}
  >
    <img
      src={pin?.image?.url || "/placeholder.png"}
      alt={pin?.title}
      className="max-w-full max-h-full object-contain"
    />
  </div>
)}

{pin.owner && user && pin.owner._id === user._id && (
      <button
        onClick={() => seteditpin(prev => !prev)}
        className="absolute top-6 right-6 bg-[#2C2C32] rounded-full z-50 p-1 shadow-lg hover:bg-gray-700 transition"
      >
        <HiOutlineDotsHorizontal className='text-white' />
      </button>
    )}

{pin.owner && user && pin.owner._id === user._id && editpin && (
      <div ref={menuRef} className='flex flex-col items-center gap-5 absolute top-1 right-6 bg-blue-500/70 backdrop-blur-md rounded-2xl z-50 text-white p-3'>
        <button onClick={edithandler}><FaEdit onClick={() => seteditpin(false)} /></button>
        <button onClick={deletepin}><MdDelete /></button>
      </div>
    )}
</div> 

:



<div className='bg-[#0F0E15]  h-screen w-full justify-center overflow-x-hidden pt-2 pb-10 flex md:hidden overflow-y-auto'>
  
{

  
         (
          <div className='bg-gray-1000 pt-8 rounded-xl shadow-md w-full max-w-md md:max-w-screen-md  flex flex-col md:flex-row'>
<BackButton pageRef={mobileRef} />
{/* LEFT - Image */}
            <div className=' relative w-full pl-3 pr-3 md:w-1/2 bg-[]#F2FAFF'>
              <img
                src={pin?.image?.url || "/placeholder.png"}
                alt={pin?.title}
                className='w-full border-1  border-black h-auto mt-3 mb-3 rounded-2xl md:max-h-full object-contain'
              />
              <TbZoomScan             
            onClick={()=>setenlarged(true)}
             className='text-white text-2xl absolute bottom-5 right-5' />
              
            </div>
            {enlarged && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition duration-300"
    onClick={() => setenlarged(false)}
  >
    <img
      src={pin?.image?.url || "/placeholder.png"}
      alt={pin?.title}
      className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out active:scale-105"
      style={{ objectPosition: 'top center' }}
    />
  </div>
)}

{

pin.owner && (  
                <div className='flex items-center justify-around  pt-5  pb-3 mb-3'>
                  <Link to={`/user/${pin.owner._id}`}>
                    <div className='rounded-full w-10 h-10 gap-2 bg-black flex items-center justify-center active:scale-125 transition-transform duration-300'>
                    {pin.owner.image && pin.owner.image.url ? (
            <img
              src={pin.owner.image.url}
              alt={user.name || 'profile'}
              className="w-full h-full object-cover rounded-full"
              style={{ objectPosition: 'top center' }}
            />
          ) : (
            <span className="text-2xl text-gray-700">{user.name?.charAt(0)}</span>
          )}        
                 
                </div >
               
                  </Link>

                  <div className='text-white -ml-18 '>
                    <h3 className='text-xs font-semibold'>{pin.owner.name}</h3>
                    <h3 className='text-xs '>{pin.owner.followers.length} Followers</h3>
                  </div>
                  <div className='flex '>
                  <Like pin={pin} userId={user._id} />
                  <PinShare pinUrl={currenturl}/>
                   </div>

                </div>
)}

            

                        {/* Title + Buttons */}
             <div className=' text-white w-full flex flex-col items-center justify-center   pt-5 '>
                {
                  edit ? (
                    <input
                      value={title}
                      onChange={(e) => settitle(e.target.value)}
                      className='common-input'
                      placeholder='New title'
                    />
                  ) : (
                    <h1 className='absolute top-2 text-sm mt-2  font-semibold'>{pin.title}</h1>
                  
                  )
                }
                   {edit && (
                <button
                  onClick={updtehandler}
                  className=' absolute right-14 top-3 bg-blue-500/70 p-2 text-md rounded-2xl text-white '
                >
                  Save
                </button>
              )}
                 {edit ? (
                <input
                  value={pinvalue}
                  className='common-input '
                  onChange={(e) => setpinvalue(e.target.value)}
                  />
              ) : (
      
               <div className='mr-70  -mt-5 flex flex-col items-center justify-center w-20'>
                <IoIosArrowDown
                  className="text-white cursor-pointer "
                  onClick={() => setdescrip((prev) => !prev)}
                />
                {descrip && (
                  <div className="text-center text-sm text-white p-3 ml-40 rounded-lg w-max max-w-xs">
                    {pin.pin}
                  </div>
                )}
               </div>
                
              

              )}
              
              {pin.owner && user && pin.owner._id === user._id && 
                (<button
                        onClick={() => (seteditpin((prev)=>(!prev)))}
                        className="absolute top-1 right-5 mt-2 bg-[#2C2C32] rounded-full z-1 p-1 shadow-lg hover:bg-gray-700 transition"
                      >
                    <HiOutlineDotsHorizontal className='text-white' />
 
                      </button>)
                }
            
           
            {pin.owner && user && pin.owner._id === user._id && editpin &&(
                  
                  <div ref={menuRef} className='flex flex-col items-center gap-5 absolute top-2 right-3 bg-blue-500/70 backdrop-blur-md rounded-2xl z-10 text-white w-auto h-auto p-3  '>
                    <button onClick={edithandler}><FaEdit onClick={()=>(seteditpin(false))} className='size-5' /></button>
                    <button onClick={deletepin} className=' text-white px-2 py-1 rounded text-sm'><MdDelete className='size-6' /></button>
                  </div>
                )}
              </div>

            {/* RIGHT - Details */}
            <div className='w-full md:w-1/2 pt-5 p-4 flex flex-col'>
            <div className='flex gap-4 items-center justify-around '>
            
            <div className='flex gap-2 w-full items-center justify-around'>
            <div onClick={handleDownload} className='w-33 p-3 ml-5 rounded-3xl text-white bg-[#2C2C32] flex items-center justify-center'>
               Download
              </div>
              <div  onClick={() => setaddtoboard(true) }className=' w-33 p-3 text-white rounded-3xl bg-blue-500 flex items-center justify-center'>
               Save
                {addtoboard && (<Addtoboard onClose={()=>(setaddtoboard(false))}/>)}
              </div>
    </div>
            </div>
           





              {/* Description */}
     

              {/* Owner */}
          

               <h2 className='text-white mt-7'>More to explore</h2>
               <div className='flex items-center  justify-center w-full'>
                              <Relatedpins pinId={pin._id}/>

               </div>

            </div>
          </div>
        )
      }
    </div>
    


}





        
         



 







    
   

</>





  );
};

export default Pinpage
