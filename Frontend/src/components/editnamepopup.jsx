import React, { useRef, useState } from "react";
import { userdata } from "../context/usercontext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import gsap from "gsap";
import useOutsideClick from "./popupremove";


function EditNamePopup({ onClose }){

   const navigate=useNavigate()
   const {updatename}=userdata()
   const [name,setname]=useState()
   const nameref=useRef(null)

   const submithandler=(e)=>{
     updatename(name,navigate)
   }

   const popupRef=useRef()


   useEffect(()=>{
    gsap.fromTo(   
        popupRef.current,
        { scale:0.5,opacity:0 },
        { scale:1 ,opacity:1, duration: 0.2,ease:"bounce.out" } 
    )
   },[navigate])

   useOutsideClick(popupRef,onClose)
  

    return (
     <>
      






     
     
     
     
      <div
  className="fixed bottom-0 left-0 w-full h-full bg-[#0F0E15]/70 soft-glass flex justify-center items-end md:items-center md:justify-center z-50"
>
        <div ref={popupRef} className="bg-[#0F0E15] p-6 rounded-2xl shadow-lg w-90  rounded-t-2xl">
          <h2 className="text-xl font-bold text-white b-4">Edit Name</h2>
          <input
            type="text"
            onChange={(e)=>setname(e.target.value)}
            placeholder="Enter new name"
            className="common-input"
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="bg-white text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button onClick={submithandler} className="bg-blue-400 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </div>
      </div>
     </>
    );
  }

  export default EditNamePopup;
  