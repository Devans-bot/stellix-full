import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userdata } from '../context/usercontext'
import { Loadinganimation } from '../components/loading'
import { use } from 'react'
import { Pindata } from '../context/pincontext'
import { RiBloggerLine } from "react-icons/ri";
import BackButton from '../components/backbutton'


const Registeruser= () => {

const [email,setemail]=useState('')
const [password,setpassword]=useState('')
const [name,setname]=useState('')

  const {fetchpins}=Pindata()

const {registeruser,btnloading}=userdata()
const navigate=useNavigate()
const submithandler=e=>{
  e.preventDefault()
  registeruser(name,email,password,navigate,fetchpins)
}

  return (
    <>
  <BackButton/>
            <div className='max-w-md bg-black p-8 h-screen w-12/12 relative left-1/2 -translate-x-1/2 overflow-hidden'>
          
               <div >
              
               </div>
               <h2 className='text-center '>Create a new account</h2>
              <form onSubmit={submithandler}>
                         <div className='text-white mt-10 flex flex-col items-center justify-centre'>
             
                          
                         <input
                             type="name"
                             className='common-input'
                             value={name}
                             onChange={(e) => setname(e.target.value)}
                             placeholder='Name'
                           /> 
                           <input
                           type="email"
                           className='common-input'
                           value={email}
                           onChange={(e) => setemail(e.target.value)}
                           placeholder='Email'
                         />
             
                           
                           <input
                             type="password"
                             className='common-input '
                             value={password}
                             onChange={(e) => setpassword(e.target.value)}
                             placeholder='Password'
                           
                           />
             


{email && password && (
                 <button
                             type='submit'
                             className='bg-blue-600   hover:bg-red-600 active:bg-blue-800 transition duration-100 ease-in-out w-30 mr-50 h-10 rounded-lg text-white mt-6'
                             disabled={btnloading}
                           >
                             {btnloading ? <Loadinganimation /> : "Register"}
                           </button>
              )}
                          
             
                         </div>
                       </form> 
             
              <div className='w-full border-t-[0.5px] border-black mt-5 relative flex items-center justify-center'>
                   <h3 className='font-thin absolute bg-black p-1'>Or</h3>
              </div>
              <div className='mt-5 ml-8'>
                <span className='font-ligt'>
                Already have an account ?
                <Link className='font-medium text-sm hover:text-blue-400 ' to="/login"
                >  Login..</Link>
              </span>
              </div>
              
            </div>
     

    </>
   )
  
}

export default Registeruser
  
