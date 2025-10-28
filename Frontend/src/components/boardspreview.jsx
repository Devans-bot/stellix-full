import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Boardspreview=()=>{
   
  const [boards,setboards]=useState([])
  const navigate= useNavigate()
  const [pressedId,setPressedId]=useState(false)

  useEffect(()=>{
    const fetchboards=async()=>{
        try {
        const {data}=await axios.get("/api/boards/userboards")
        setboards(data)
    } catch (error) {
      console.log(error)
    }
    }
  fetchboards()
  },[])


  return(


    <>

<div className="hidden md:grid w-3xl  relative left-90 grid-cols-4 sm:grid-cols-3 h-8/12 md:grid-cols-3 gap-9  grid-rows-3  ">

    {boards.map((board) => (
      <div
        key={board._id}
        onClick={() => navigate(`/boards/${board._id}`)}
        className="h-11/12 relative overflow-hidden rounded-3xl bg-black/30   bg-opacity-40 flex 
                   shadow-md duration-300 hover:scale-75 transition active:scale-95"
                   onTouchStart={() => setPressed(true)}
                   onTouchEnd={() => setPressed(false)}
                   style={{ transform: pressedId ? "scale(0.95)" : undefined }}
      >
        {/* Preview Image */}
        {board.previewImage ? (
          <img
            src={board.previewImage.url}
            alt={board.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Pins</span>
          </div>
        )}

        {/* Overlay with Board Name */}
        <div className="absolute p-2 bg-black/30 inset-0  bg-opacity-40 flex items-end justify-center">
          <span className="text-white p-1 px-3 bg-black/80 rounded-2xl text-lg font-semibold">
            {board.name}
          </span>
        </div>
      </div>
    ))}
  </div>















<div className="md:hidden p-3 mt-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    {boards.map((board) => (
      <div
        key={board._id}
        onTouchStart={() => setPressedId(board._id)}
        onTouchEnd={() => setPressedId(null)}
        onClick={() => navigate(`/boards/${board._id}`)}
        className={`relative cursor-pointer rounded-[30%] aspect-square overflow-hidden shadow-md transition-transform duration-150 ${
          pressedId === board._id ? "scale-95" : "scale-100"
        }`}
      >
        {/* Preview Image */}
        {board.previewImage ? (
          <img
            src={board.previewImage.url}
            alt={board.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Pins</span>
          </div>
        )}

        {/* Overlay with Board Name */}
        <div className="absolute p-2 bg-black/30 inset-0  bg-opacity-40 flex items-end justify-center">
          <span className="text-white p-1 px-3 bg-black/80 rounded-2xl text-lg font-semibold">
            {board.name}
          </span>
        </div>
      </div>
    ))}
  </div>
    </>
   
);
}

export default Boardspreview