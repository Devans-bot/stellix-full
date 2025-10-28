import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiBloggerLine } from "react-icons/ri";
import { IoMdHome } from "react-icons/io";
import { HiOutlinePlusCircle } from "react-icons/hi";
import Searchbar from "./searchbar";
import Topics from "./topics";
import { IoCreateOutline } from "react-icons/io5";
import { TbLayoutCollage } from "react-icons/tb";
import { useUpload } from "../context/uploadcontext";
import { FaSearch } from "react-icons/fa";
import useOutsideClick from "./popupremove";
import { GiFairyWand } from "react-icons/gi";
import { HiOutlineHome } from "react-icons/hi2";
import { TbEdit } from "react-icons/tb";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import gsap from "gsap";
import { RiSearch2Line } from "react-icons/ri";
import { LuCircleFadingPlus } from "react-icons/lu";
import { NIL } from "uuid";
import logo from "../assets/S.gif";



const Navbar = ({ user }) => {
  const {setUploadFile,setUploadFilePrev,uploadFilePrev}=useUpload()
  const [Open,setOpen]=useState(false)
  const [imageLoaded, setImageLoaded] = useState(false);

  const [issearchbaropen, setissearchbaropen] = useState(false);
  const location = useLocation();
  const homepage = location.pathname === "/";
  const inputref=useRef(null)
 const navigate=useNavigate()
  const menuref=useRef()
  
  useEffect(() => {
    if (user?.image?.url) setImageLoaded(true);
  }, [user]);
  useOutsideClick(menuref, () => setOpen(false))

  const handelclick=()=>{
      inputref.current.click()
      
  }

  const handleReload = () => window.location.reload();

const popupRef=useRef(null) 
useLayoutEffect(() => {
  if (!menuref.current) return;

  const children = Array.from(menuref.current.children); // get children for stagger

  if (Open) {
    gsap.fromTo(
      children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" }
    );
  } else {
    gsap.to(children, {
      y: 50,
      opacity: 0,
      stagger: 0.05, // stagger out too
      duration: 0.3,
      ease: "power3.in"
    });
  }
}, [Open]);



  const changefilehandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    reader.onloadend = () => {
      setUploadFile(file);
      setUploadFilePrev(reader.result);
      navigate("/create");
      setOpen(false) // ✅ go to create page after selecting  
    };
  };
 

  const [Pressed,setPressed]=useState(false)
  return (
    <>
      {/* Show topics only on homepage when searchbar is closed */}

      {/* ✅ Desktop Sidebar Navbar - Left Side */}
      <div className="hidden md:flex flex-col items-center justify-around  rounded-3xl  fixed top-3/11 left-10 h-7/12  w-19 bg-[#242424] backdrop-blur-2xl  z-50 shadow-md">
        {/* Blogger Icon */}
        <div  className="flex flex-col pl-2 gap-18">
        
        {/* Nav Icons */}
        
        <Link to="/"
      
        style={{ transform: Pressed ? "scale(0.95)" : undefined }}>
         <HiOutlineHome className={` size-8 ${location.pathname === "/" ? "text-white" : "text-white"} hover:text-blue-500 hover:scale-85 transition duration-300`}
           
           onTouchStart={() => setPressed(true)}
           onTouchEnd={() => setPressed(false)}/>         
        </Link>


    
        

            <div
              className="flex flex-col items-center justify-center gap-1 cursor-pointer"
              onClick={handelclick}
            >
              <input
                name="file"
                onChange={changefilehandler}
                ref={inputref}
                type="file"
                accept="image/*"
                className="hidden"
              />
               <LuCircleFadingPlus 
             className="text-white size-7 mr-3 hover:text-blue-500 hover:scale-85 transition duration-300" />

            </div>
          
            <Link
            to="/aiimage"
            onClick={() => setOpen((prev) => !prev)}
          >
            <BsStars 
                  className="text-white size-7 mr-3 hover:text-blue-500 hover:scale-85 transition duration-300"
/>
          </Link>

          <Link
            to="/board"
              className="flex  flex-col items-center gap-2"
          >
            <MdOutlineCollectionsBookmark 
             className="text-3xl mr-3 text-white hover:text-blue-500 hover:scale-85 transition duration-300" 
             onTouchStart={() => setPressed(true)}
             onTouchEnd={() => setPressed(false)} />
          </Link>
         
      
       
        </div>
       
      </div>
      <Link
            to="/account"
            className="bg-neutral-500   absolute top-7 right-14 z-10 w-10 h-10 rounded-full hidden md:flex items-center justify-center text-white font-semibold hover:scale-150 hover:border-2 border-blue-500 transition duration-200"
          >
         {imageLoaded ? (
  <img
    src={user.image.url}
    alt={user?.name || 'profile'}
    className="w-full h-full object-cover rounded-full"
    onTouchStart={() => setPressed(true)}
    onTouchEnd={() => setPressed(false)}
  />
) : (
  <span className="text-5xl text-gray-700">
    {user?.name ? user.name.charAt(0) : 'U'}
  </span>
)}

          </Link>
          <Link to="/" className="hidden md:block">
            <img src={logo} onClick={handleReload} alt="" className=' absolute -mt-2 top-0 left-12 z-30  h-2/12' />
          </Link>

          

      {/* ✅ Mobile Bottom Navbar */}

      <div className="fixed bg-red  md:hidden  bottom-1 left-1/2 transform -translate-x-1/2 flex items-center gap-4 justify-evenly h-16  z-40  p-4  w-70 rounded-3xl bg-black/70 backdrop-blur-md border-1 border-black">
      <Link to="/">
         <HiOutlineHome className={` size-7 active:scale-130 transition-transform duration-200 ease-out ${location.pathname === "/" ? "text-white" : "text-white"}`}/>
         {/* <IoMdHome `} /> */}
        </Link>
        
        <button onClick={()=>(setissearchbaropen((prev)=>(!prev)))}>
        <RiSearch2Line className="size-6 text-white active:scale-130 transition-transform duration-200 ease-out" />

        </button>

        
        <LuCircleFadingPlus 

        onClick={() => setOpen((prev) => !prev)} className="text-white size-6 active:scale-130 transition-transform duration-200 ease-out" />
        
     


        <Link to="/account">
          <div className="bg-neutral-500 w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-sm active:scale-130 transition-transform duration-200 ease-out">
          {user?.image?.url ? (
  <img
    src={user.image.url}
    alt={user?.name || 'profile'}
    className="w-full h-full object-cover rounded-full"
    onTouchStart={() => setPressed(true)}
    onTouchEnd={() => setPressed(false)}
  />
) : (
  <span className="text-5xl text-gray-700">
    {user?.name ? user.name.charAt(0) : 'U'}
  </span>
)}        </div>
        </Link>
      </div>
       
      {issearchbaropen  && (
         <Searchbar isopen={issearchbaropen} setisopen={setissearchbaropen} />
          )}
       
       {
  
// {Open && (
  <>
    {/* Backdrop overlay with blur */}

    {/* Popup menu without backdrop blur */}

    {
       Open && (

        <div
        ref={menuref}
            className={`fixed right-2/12  bottom-19 w-57 rounded-3xl  bg-[#1e96fc]/70 backdrop-blur-md  z-40 `}
           
      > 
    
        <div className="flex h-full rounded-3xl p-3 justify-around items-center w-full">
          {/* Upload / Post */}
          {!uploadFilePrev && (
            <div
              className="flex flex-col items-center justify-center gap-1 cursor-pointer"
              onClick={handelclick}
            >
              <input
                name="file"
                onChange={changefilehandler}
                ref={inputref}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <TbEdit 
              className="text-2xl text-white active:scale-130 transition-transform duration-200 ease-out" />
              <h2 className="text-xs text-white">Post</h2>
            </div>
          )}
  
          {/* Element */}
          <Link
            to="/board"
            onClick={() => setOpen((prev) => !prev)}
            className="flex ml-3 flex-col items-center gap-2 "
          >
            <MdOutlineCollectionsBookmark 
             className="text-2xl text-white active:scale-130 transition-transform duration-200 ease-out" />
            <h2 className="text-xs text-white">Element</h2>
          </Link>
  
          {/* Magic AI */}
          <Link
            to="/aiimage"
            onClick={() => setOpen((prev) => !prev)}
            className="flex flex-col items-center gap-2 active:scale-130 transition-transform duration-200 ease-out"
          >
            <BsStars 
            className="text-2xl text-white active:scale-130 transition-transform duration-200 ease-out" />
            <h2 className="text-xs text-white">Magic Ai</h2>
          </Link>
        </div>
      </div>

       )
    }
  
   
    

  </>


  
}
    </>
  );
};

export default Navbar;
  