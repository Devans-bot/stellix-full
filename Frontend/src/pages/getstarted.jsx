import React from 'react'
import { useNavigate } from 'react-router-dom'
import myimage from"../assets/IMG_4154.PNG"
import facebook from"../assets/facebook.jpeg"
import google from "../assets/google.jpeg"
import { RiBloggerLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import logo from "../assets/S.gif"
import dlogo from"../assets/dlogo.png"

const Getstarted = () => {
    
    
    const navigate=useNavigate()

    const handleonclick=()=>{
        navigate("/login")
    }
  return (
    
<>
<div className='bg-black hidden md:block relative h-screen z-0'>
      
      <img src={dlogo} alt=""  
      className="absolute inset-0 p-3 w-full h-full object-cover z-0"
 />
      
      <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center pb-50"  > 

      <div className='flex  items-center justify-center'>
      <img src={logo} className='h-45  -mb-10' alt="" />

      </div>

      <div className='flex flex-col items-center justify-center mt-8'> 

      <div className='w-60 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white p-2 hover:bg-blue-800'>
            <Link to="/register">Continue with email</Link>
         </div>
        
         <div className='w-60 h-11 rounded-2xl bg-white flex items-center justify-center text-black mt-3 p-2 hover:bg-gray-200'>
            <img src={google} className='h-7' alt="" />
            <h3 className='pl-3'>Continue with Google</h3>
         </div>

         <div className='text-white text-sm w-60 mt-6 flex items-center justify-center'>
                     <h2>Already a member ?  </h2>
                     <Link className='pl-2' to="/login">Login</Link>
         </div>

         
      </div>
      <div className='h-40 absolute flex items-center justify-around bottom-1  text-black w-8/12 bg-white rounded-t-3xl p-3 '>  
       <div>
       <h2 className='font-bold text-xl mt-1'>Continue to Stellix </h2>
       <h3 className='text-sm mt-3'>Hmm, it looks like you dont't have an account yet. Let's get started ! </h3>
       </div>
        <div className="w-full max-w-xs h-11 mt-4 rounded-2xl bg-blue-600 flex items-center justify-center text-white p-2 hover:bg-blue-800">
   <Link to="/register">Sign Up !</Link>
</div>
      </div>
      </div>
      
    </div>






<div className='bg-black block md:hidden relative h-screen z-0'>
      
      <img src={myimage} alt=""  
      className="absolute inset-0 p-3 w-full h-full object-cover z-0"
 />
      
      <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center pb-50"  > 

      <div className='flex  items-center justify-center'>
      <img src={logo} className='h-45  -mb-10' alt="" />

      </div>

      <div className='flex flex-col items-center justify-center mt-8'> 

      <div className='w-60 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white p-2 active:bg-blue-800 active:scale-90 transition duration-300'>
            <Link to="/register">Continue with email</Link>
         </div>
        
         <div className='w-60 h-11 rounded-2xl bg-white flex items-center justify-center text-black mt-3 p-2 active:scale-90 transition-transform duration-300'>
            <img src={google} className='h-7 ' alt="" />
            <h3 className='pl-3'>Continue with Google</h3>
         </div>

         <div className='text-white text-sm w-60 mt-6 flex items-center justify-center'>
                     <h2>Already a member ?  </h2>
                     <Link className='pl-2 active:scale-110 transition duration-300' to="/login">Login</Link>
         </div>

         
      </div>
      <div className='h-40 absolute bottom-1  text-black w-full bg-white rounded-t-3xl p-3'>  
        <h2 className='font-bold text-xl mt-1'>Continue to Stellix </h2>
        <h3 className='text-sm mt-3'>Hmm, it looks like you dont't have an account yet. Let's get started ! </h3>
        <div className="w-full max-w-xs h-11 mt-4 rounded-2xl bg-blue-600 flex items-center justify-center text-white p-2 active:bg-blue-800 active:scale-90 transition duration-300">
   <Link to="/register">Sign Up !</Link>
</div>
      </div>
      </div>
      
    </div>
    
</>
    
  )
}

export default Getstarted
