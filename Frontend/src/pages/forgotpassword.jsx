// pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { userdata } from '../context/usercontext';
import BackButton from '../components/backbutton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

const {forgot}=userdata()

  const handleSubmit = (e) => {
    e.preventDefault();
    forgot(email)
 
  };

  return (
<div className='w-full h-full rounded-2xl flex items-center justify-center  p-4'>
  <BackButton/>
  <form onSubmit={handleSubmit} className="flex flex-col pt-10 gap-3 w-full h-full md:w-5/12 ">
    <h2 className="text-xl font-semibold">Forgot Password</h2>  
    <input
      type="email"
      placeholder="Registered Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="common-input"
    />
    <button
      type="submit"
      className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-800 transition"
    >
      Send Reset Link
    </button>
  </form>
</div>

    
  );
};

export default ForgotPassword;
