import React, { useEffect, useRef, useState } from 'react'
import Masonry from 'react-masonry-css'
import { Pindata } from '../context/pincontext'
import { Loading } from '../components/loading'
import Pincard from '../components/pincard'
import { useNavigate } from 'react-router-dom'
import Topics from '../components/topics'
import Searchbar from '../components/searchbar'

const Home = () => {
  const { pins, loading,filter,setfilter } = Pindata()
 
 
  const [open,setopen]=useState(false)
  const desktopview = {
    default: 5,
    1400: 5,
    1200: 4,
    992: 3,
    700: 2,
    480: 1,
  };
  const mobileview = {
    default: 6,
    1400: 5,
    1200: 4,
    992: 3,
    700: 2,
    480: 2,
  };

  if (loading) return <Loading />

  if (!pins || pins.length === 0) return <p className="text-center mt-10">No pins yet</p>

  return (


 

<div className='-mb-2  overflow-auto scrollbar-none min-h-screen'> 
    
    <div className=" bg-[#00000] overflow-hidden mt-28 w-8xl pl-40 hidden md:block">
    <div className="  fixed top-0 left-0 right-0 z-1 bg-black/90 backdrop-blur-md px-6 pb-20 pt-5  h-1/10">
    <input type="text" 
        className=' text-sm  text-white bg-[#242424] h-13 block w-7/12 relative top-1/9  left-3/12 px-3 py-1 rounded-xl  shadow-sm focus:outline-none sm:text-sm;
'      
   onClick={()=>setopen(true)}
placeholder='Search..'
        />
      </div>
      <Topics/>
      <Masonry
        breakpointCols={desktopview}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {pins.map((pin,i) => (
  <Pincard key={pin._id} pin={pin} index={i} />
))}
      </Masonry>

      
    </div>
    {open && <Searchbar isopen={open} setisopen={setopen}/>}


    
    <div  id="home-scroll-root" className="bg-[#0F0E15] -mt-2 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 block md:hidden">
      <div className='h-9'><h1>.</h1></div>
      <Topics/>
      <Masonry
        breakpointCols={mobileview}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {pins.map((pin,i) => (
  <Pincard key={pin._id} pin={pin}  index={i}/>
))}
      </Masonry>
    </div>

    </div>

  
   
  )
}

export default Home
