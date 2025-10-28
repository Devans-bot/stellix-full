import { createContext, useContext, useEffect, useState } from "react";
import React from 'react';
import toast, {Toaster} from 'react-hot-toast'
import axios from 'axios';
import { Pindata } from "./pincontext";


const Usercontext=createContext()

export const UserProvider=({children})=>{

  const [user,setuser]=useState('')
  const [isauth,setisauth]=useState(false)
  const [btnloading,setbtnloading]=useState(false)

  async function loginuser(email,password,navigate,fetchpins){
    setbtnloading(true)
     try {
          const {data}=await axios.post("/api/user/login",{email,password})
          if (!data.user || !data.user.name) {
            toast.error("User not found");
            return;
          }
          toast.success(data.message)
          setbtnloading(false)
          navigate("/")
          fetchpins()
          setuser(data.user)
          setisauth(true)
          
     } catch (error) {
      toast.error(error.response.data.message)
     }
     finally {
      setbtnloading(false); // ✅ always stop loading
    }
  }
  
  async function registeruser(name,email,password,navigate,fetchpins){
    setbtnloading(true)
     try {
          const {data}=await axios.post("/api/user/register",{name,email,password})
           
          toast.success(data.message)
          setbtnloading(false)
          navigate("/")
          fetchpins()
          fetchuser()
          setuser(data.user)
          setisauth(true)
          setbtnloading(true)
     } catch (error) {
      toast.error(error.response.data.message)
     }
  }

  const [loading,setloading]=useState(true)


  async function fetchuser() {
    try {
      const { data } = await axios.get("/api/user/me");
      setuser(data);
      setisauth(true);
      setloading(false)
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // not authenticated
        setisauth(false);
       setloading(false)
      }
    } finally {
      setloading(false);
    }
    
  }



  async function follow(id,fetchUser){
    try {
      const {data}= await axios.post("/api/user/follow/"+id)
      fetchUser()
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  async function forgot(email){
    try {
      const {data}=await axios.post("/api/user/forgot-password",{email})
      toast.success(data.message)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  async function reset(token,password){
    try {
       const {data}=await axios.post(`/api/user/reset-password/${token}`,{password})
       toast.success(data.message)
       navigate("/")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
}

async function updatename(name,navigate) {
  try {
    const {data}=await axios.post("/api/user/username",{name})
    toast.success(data.message)
    if(data)(
          navigate("/account")
        
    )
 window.location.reload()
  } catch (error) {
    console.log(error)
  }
  
}

  useEffect(()=>{
    fetchuser();
  },[])
    return (
        <Usercontext.Provider value={{loginuser,updatename,btnloading,isauth,user,loading,registeruser,setisauth,setuser,follow,forgot,reset}}>
          {children}
        <Toaster/>
        </Usercontext.Provider>
    )
}
export const userdata=()=>useContext(Usercontext)
