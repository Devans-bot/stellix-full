import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Masonry from 'react-masonry-css' // if you use this package
import Pincard from './pincard'       // adjust the path accordingly
import { Pindata } from '../context/pincontext'
import { useParams } from 'react-router-dom'
import { Loading, Loadinganimation } from './loading'

const mobileview = {
  default: 1,
  640: 2,
  768: 3,
  1024: 4
}
const desktopview = {
  default: 2,
  640: 2,
  768: 3,
  1024: 4
}

const Relatedpins = ({ pinId }) => {

  
   const [rpins,setrpins]=useState([])
   const [nloading,setnloading]=useState(false)

  useEffect(() => {
    const fetchRelatedPins = async () => {
       
      try {
        setnloading(true)
        const { data } = await axios.post("/api/pins/relatedpins", { pinId })
        setrpins(data.results)
        setnloading(false)
      } catch (error) {
        console.error(error)
      }
    }

    if (pinId) {
      fetchRelatedPins()
    }
  }, [pinId, setrpins])


  return (
    <>
     {nloading ? <Loadinganimation />:  <div className=" mt-5 max-w-3xl hidden md:block">
     
     <Masonry
       breakpointCols={desktopview}
       className="my-masonry-grid"
       columnClassName="my-masonry-grid_column"
     >
       {rpins.map((pin) => (
         <Pincard key={pin._id || pin.id} pin={pin} />
       ))}
     </Masonry>
   </div>}
 
 
 
    {/*mobile view*/}
    {nloading ? <Loadinganimation/>:  <div className="bg-[#0F0E15] mt-5 max-w-7xl block md:hidden">
     
     <Masonry
       breakpointCols={mobileview}
       className="my-masonry-grid"
       columnClassName="my-masonry-grid_column"
     >
       {rpins.map((pin) => (
         <Pincard key={pin._id || pin.id} pin={pin} />
       ))}
     </Masonry>
   </div>}
    </>
   )
}

export default Relatedpins
