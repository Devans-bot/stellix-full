import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import useOutsideClick from './popupremove'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { Loadinganimation } from './loading'

const Addtoboard = ({onClose}) => {

    const [loading,setLoading]=useState(true)
    const {id:pin}=useParams()

   const popupref= useRef()
   useOutsideClick(popupref,onClose)
    const [boards,setboards]=useState([])
   useEffect(()=>{
    const fetchboards=async()=>{
         try {
        const{data}=await axios.get("/api/boards/userboards")
        setboards(data)
    } catch (error) {
        console.log(error)
    }finally{
        setLoading(false)
    }
    }
   fetchboards()
   },[])

   const submithandler=async(boardId)=>{
    try {
        const {data}=await axios.post(`/api/boards/newpin/${pin}`,{boardId})
        toast.success(data.message)
        onClose()
    } catch (error) {
        console.log(error)
    }
   }

   console.log(boards)
  return (
    <div className='fixed right-0 bottom-0 z-50 bg-blue-500/70 flex flex-col items-center gap-3 backdrop-blur-md mt-10 rounded-t-4xl p-5 h-auto w-full' ref={popupref}>

    <h2>Add to a board !</h2>
   {loading ? (
      <Loadinganimation/> 
    ) : boards.length > 0 ? (
      boards.map((board) => 
        <div  key={board._id} className='bg-white/80 text-black rounded-xl p-1 w-2/4'>    
          <button onClick={()=>(submithandler(board._id))} className='text-l w-full  ' >{board.name}</button>
        </div>
    ) ): (
      <h2>No boards found</h2>
    )}
    </div>
  )
}

export default Addtoboard
