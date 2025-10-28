import axios from 'axios'
import React, { useDebugValue, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BackButton from '../components/backbutton'
import Masonry from 'react-masonry-css'
import Pincard from '../components/pincard'
import { IoMdMenu } from "react-icons/io";
import { FaTrash, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import useOutsideClick from '../components/popupremove'
import gsap from 'gsap'


const Boardpins = () => {

    const openref=useRef()
    const [open,setopen]=useState(false)
    const [deletemode,setdeletemode]=useState(false)
    const [selectedPins,setselectedPins]=useState([])
    const navigate=useNavigate()
     
  useEffect(()=>{
    if(open && openref.current){
      gsap.fromTo(
        openref.current,
        { scale: 0.5, opacity: 0 },
         { scale: 1, opacity: 1, duration: 0.2, ease: "bounce.out" }
      )
    }
  })


    useOutsideClick(openref,()=>setdeletemode(false))

    const mobileview = {
      default: 6,
      1400: 5,
      1200: 4,
      992: 3,
      700: 2,
      480: 2,
    };
    const {boardId}=useParams()

    const [pins,setpins]=useState([])

   useEffect(()=>{
    const fetchpins=async()=>{
        try {
            const {data}=await axios.post(`/api/boards/boardpins/${boardId}`)
            setpins(data.pins || [])
        } catch (error) {
            console.log(error)
        }
    }
    fetchpins()
   },[boardId])

   const toggleSelectPin = (pinId) => {
    setselectedPins((prev) =>
      prev.includes(pinId)
        ? prev.filter((id) => id !== pinId)
        : [...prev, pinId]
    );
  };

  const handleDeletePins=async()=>{
    try {
      const {data}=await axios.post("/api/boards/deletepins",{pins:selectedPins,boardId:boardId})
      setpins((prev)=>prev.filter((pin)=>!selectedPins.includes(pin._id)))
      setselectedPins([])
      setdeletemode(false)
      navigate("/account")
    } catch (error) {
      console.log(error)
    }
  }

  

  const deleteboard=async()=>{
    try {
      const {data}=await axios.post(`/api/boards/deleteboard/${boardId}`)
      toast.success(data.message)
      navigate("/account")
    } catch (error) {
      console.log(error)
    }
  } 


  return (
    <>      <BackButton/>
    <div className='min-h-screen w-full md:relative md:left-2/12 md:mt-10 *:md:overflow-hidden md:w-8/12 bg-black'>
    <div >
    <IoMdMenu
        onClick={() => setopen((prev) => !prev)}
        className="text-3xl text-white cursor-pointer absolute md:top-0 top-2 right-2"
      />
    {open && 
    <div           ref={openref}
    className='h-20 w-30 bg-blue-500 text-white absolute top-5 right-7 z-20 rounded-2xl flex flex-col items-center justify-evenly gap-2'>
        <button onClick={()=>{setdeletemode(true);setopen(false)}}>Delete Pins</button>
        <button onClick={deleteboard}>Delete board</button>
    </div>}
    </div>
    <div className='p-4   pt-10'>
    
    <Masonry
              breakpointCols={mobileview}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
               {pins.map((pin) => (
                <div key={pin._id || pin.id} className='relative'>
                            <Pincard  pin={pin} />
                            { deletemode && (
            <button
              onClick={() => toggleSelectPin(pin._id)}
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow z-10"
              >
              {selectedPins.includes(pin._id) ? (
                <FaCheck className="text-green-600" />
              ) : (
                <FaTrash className="text-red-600" />
              )}
            </button>
          )}
                </div>
       
        ))}
                                   
            </Masonry>
            {deletemode && selectedPins.length > 0 && (
        <button
          onClick={handleDeletePins}
          className="absolute md:top-0 md:right-13 top-2  right-10 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg"
        >
          Submit
        </button>
      )}
    </div>
    </div>
    
     
  
    </>

  );
  
}

export default Boardpins
