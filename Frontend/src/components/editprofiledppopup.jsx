import React, { useState } from 'react'
import { CiCirclePlus } from "react-icons/ci";
import axios from 'axios';
import { userdata } from '../context/usercontext';
import { data, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loadinganimation } from './loading';




const Editprofiledp = ({onClose}) => {

const navigate=useNavigate()
const [file,setfile]=useState("")
const [preview,setpreview]=useState(null)
const {user,setuser}=userdata()

const handlechange=(e)=>{
    const selected=e.target.files[0]
    if(selected){
        setfile(selected)
        setpreview(URL.createObjectURL(selected))
    }
}

const [loading,setloading]=useState(false)


const submithandler=async()=>{
if(!file){
    onclose()
}

try {
     setloading(true)
    const formdata=new FormData()
    formdata.append("file",file)
    const {data}=await axios.post(`/api/user/dp/${user._id}`,formdata)
    setloading(false)
    toast.success("Profile picture updated !")
       onClose()
       if(data.user){
        setuser(data.user)
    }
         navigate(`/account/${user._id}`);
 
    console.log("upload success")

} catch (error) {
    console.log(error)
}
}
  return (
    <div className="fixed md:items-center bg-black/60 soft-glass inset-0  flex items-end justify-center z-50">
    <div className="bg-[#0F0E15]   pt-8 p-6 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center gap-6">
      {/* Upload Area */}
      <label className="cursor-pointer flex flex-col items-center">

     
    <div className='mb-5'>
      {loading ? <Loadinganimation/>
    :<h1>Add a photo</h1>}
    </div>
    
       
     
     {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 rounded-full object-cover"
        />
      ) : (
        <CiCirclePlus className="text-5xl text-white" />
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlechange}
      />
    </label>
      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="bg-white text-black px-4 py-2 rounded shadow"
        >
          Cancel
        </button>
        <button
          onClick={submithandler}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Save
        </button>
      </div>
    </div>
  </div>

  )
}

export default Editprofiledp
