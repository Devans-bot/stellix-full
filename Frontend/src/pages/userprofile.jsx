import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Pindata } from '../context/pincontext'
import Pincard from '../components/pincard'
import Masonry from 'react-masonry-css'

import { userdata } from '../context/usercontext'
import BackButton from '../components/backbutton'

const Userprofile = ({user: loggedInUser}) => {


  const breakpointColumnsObj = {
    default: 4,  // desktop and large screens
    1100: 3,     // smaller desktops/tablets
    700: 2,      // tablets/large phones
    480: 2,      // small phones - 2 columns for nicer grid
    320: 1       // smallest phones - single column
  }

   const params= useParams()
   const[user,setuser]=useState([])
 
   async function fetchUser() {
    try {
      const {data} = await axios.get(`/api/user/${params.id}`)
      setuser(data)
    } catch (error) {
      console.log(error)
    }
   }
const [isfollow,setisfollow]=useState(false)

const followhandler = () => {
  if (!user?._id) return;
  setisfollow(!isfollow)
  follow(user._id, fetchUser)
}

const followers=user.followers
useEffect(()=>{
  if(followers && followers.includes(loggedInUser._id)) setisfollow(true)
},[user])

   useEffect(()=>{
    fetchUser()
   },[])

   const {follow}=userdata()

   const {pins}=Pindata()

    let userpins

    if(pins){
        userpins=pins.filter(pin=> pin.owner === user._id)
    } 
  return (



    <>
      <div className='min-h-screen md:w-7xl md:relative md:left-1/10 md:overflow-x-hidden bg-black'>

      <div className=' '>
      <BackButton/>
      <div className='flex flex-col items-center justify-center'>
        <div className='p-6 w-full'>
            <div  className='flex items-center justify-center'>
                 <div className='w-24 h-24 rounded-full bg-black flex items-center justify-center'>
                 {user.image && user.image.url ? (
            <img
              src={user.image.url}
              alt={user.name || 'profile'}
              className="w-full h-full object-cover rounded-full"
              style={{ objectPosition: 'top center' }}
            />
          ) : (
            <span className="text-5xl text-white">{user.name?.charAt(0)}</span>
          )}                 </div>
                 
            </div>

            
            <div className='flex justify-center flex-col items-center mt-4 space-x-2'>
            <h1 className='text-centre text-2xl text-white font-bold mt-4'>{user.name}</h1>
            <p className='text-centre text-white mt-2'>{user.email}</p>
            <div className='text-centre text-xs flex gap-2  text-white mt-8 mb-5'>
            <h3 className='bg-blue-500/80 rounded-2xl p-2'>{user?.followers?.length || 0}-followers</h3>
            <h3 className='bg-blue-500/80 rounded-2xl p-2'>{user?.following?.length || 0}-following</h3>

            </div>

            <button className='bg-blue-500/80 text-white font-bold text-md mb-4 p-3 mt-2 rounded-lg ' onClick={followhandler} >
              {isfollow ? "Unfollow" : "Follow"}
              </button>
            </div>
            <div className='mt-4 flex flex-wrap justify-center'>
                {
                  <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                   {  userpins && userpins.length>0?userpins.map((e)=>(
                        <Pincard key={e._id} pin={(e)}/>
                    )) :<p>No pins yet</p>}
                </Masonry>
                   
                }
            </div>
        </div>
      </div> 
    </div>
    </div>


    
    


    
    </>
  
    
  )
}

export default Userprofile
