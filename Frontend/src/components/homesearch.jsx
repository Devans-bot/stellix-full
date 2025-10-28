import React, { useState } from 'react'
import Searchbar from './searchbar'
import { useSearchParams } from 'react-router-dom'

const HomeSearch = () => {


    const [open,setopen]=useState(false)
  return (
    <div>
       <div className='h-17 fixed inset-0 z-50 py-6 mt-4 mb-4 flex items-center  '>
        <input type="text" 
        className=' text-sm   text-white bg-white/10 h-15 block w-6xl mt-2 ml-20 px-3 py-2 border-white border-2 rounded-2xl  shadow-sm focus:outline-none sm:text-sm;
'      
   onClick={()=>setopen(true)}
placeholder='Search..'
        />

        {open && <Searchbar isopen={open} setisopen={setopen}/>}
      </div>
    </div>
  )
}

export default HomeSearch
