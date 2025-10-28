import React, { useState } from 'react'
import { userdata } from '../context/usercontext'
import { useParams } from 'react-router-dom'

const Resetpassword = () => {

const {reset}=userdata()
const {token}=useParams()

const [password,setpassword]=useState()

const handleSubmit=(e)=>{
    e.preventDefault()
     reset(token,password)
}

  return (
    <div className='h-full w-full flex items-center justify-center bg-black'>
        <form onSubmit={handleSubmit} className='h-full w-full md:w-4/12  p-4'>
      <h2 className='text-2xl font-bold mt-10 mb-30'>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
        required
        className='  common-input '
      />
      <button type="submit" className='bg-blue-500 p-4 rounded-2xl mt-10 hover:bg-blue-800'>Reset Password</button>
     
    </form>
    </div>
  )
}

export default Resetpassword
