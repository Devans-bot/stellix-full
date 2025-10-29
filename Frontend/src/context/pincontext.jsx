import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Pincontext=createContext()


export const Pinprovider=({children})=>{


     const [pins,setpins]=useState([])
     const [loading,setloading]=useState(false)
     const [rpins,setrpins]=useState([])
     const [filter,setfilter]=useState("all")

     async function fetchpins(){
      try {
        const url = filter === "following" ? "/api/pins/following":"/api/pins/all"
        const {data}=await axios.get(url)
        setpins(data)
        setloading(false)
        if(filter===pins){
          console.log(pins)
        }
      } catch (error) {
      
        setloading(false)
      }
     }

    const [pin,setpin]=useState([])
    
    async function fetchpin(id){
      setpin(null)
      try {
          const {data}= await axios.get("/api/pins/single/"+id)
          setpin(data)
      } catch (error) {
          console.log(error)
          setloading(false)
      }
  }

   async function updatepin(id,title,pin,setedit){
     try {
      const {data}=await axios.put("/api/pins/"+id,{title,pin})
      toast.success(data.message)
      fetchpin(id)
      setedit(false)
     } catch (error) {
      toast.error(error.response.data.message)
     }
   }

   async function addcmmnt(id,comment,setcmmnt){
    try {
      const {data}= await axios.post("/api/pins/comment/"+id,{comment})
      toast.success(data.message)
      fetchpin(id)
      setcmmnt('')
    } catch (error) {
      
    }
   }

  async function deletecomment(id, commentid) {
    try {
      const { data } = await axios.delete(
        `/api/pins/deletecomment/${id}?commentId=${commentid}`
      );
      toast.success(data.message);
      fetchpin(id);
    } catch (error) {
      console.error("Delete comment error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }
  
  async function deletePin(id,navigate){
     try {
      const { data } = await axios.delete(
        `/api/pins/${id}`
      );  
      toast.success(data.message)
      navigate('/')
      setloading(false)
      fetchpins()
     } catch (error) {
      console.log(error)
     }
  }

  
  async function addpin(formdata, setUploadFilePrev, setUploadFile, settitle, setpin, navigate) {
    try {
      setloading(true);
      const { data } = await axios.post("/api/pins/createpin", formdata);
  
      if(data){
        navigate("/");
      }
      toast.success(data.message);
      setUploadFile([]);
      setUploadFilePrev("");
      setpin("");
      settitle("");
      fetchpins();
      
  
    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
    } finally {
      setloading(false); // ✅ Always runs
    }
  }
  


const likePin = async (pinId) => {
  try {
    const { data } = await axios.put(`/api/pins/like/${pinId}`);
    return data; // data = { msg, likescount, liked }
  } catch (error) {
    console.error("Error liking pin:", error);
  }
};




     useEffect(()=>{
        fetchpins()
     },[filter])
      
     


    return <Pincontext.Provider value={{pins,filter,setfilter,loading,setloading,fetchpin,pin,updatepin,addcmmnt,deletecomment,deletePin,addpin,fetchpins,likePin,rpins,setrpins}}>{children}</Pincontext.Provider>
}

export const Pindata=()=>useContext(Pincontext)