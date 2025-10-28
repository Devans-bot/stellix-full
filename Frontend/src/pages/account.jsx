import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { userdata } from '../context/usercontext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProfilePreviewCard from '../components/profilepreview';
import BoardsPreview from '../components/boardspreview';
import { CiMenuKebab } from 'react-icons/ci';
import useOutsideClick from '../components/popupremove';
import gsap from 'gsap';

const Account = ({ user }) => {
  const [open, setopen] = useState(false);
  const [edit, setedit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setisauth, setuser } = userdata();

  const inforef = useRef(null);
  const pinsRef = useRef(null);
  const boardsRef = useRef(null);
  const openref = useRef(null);
  const editref = useRef(null);
  const nameref=useRef(null)

  useOutsideClick(openref, () => setopen(false));
  useOutsideClick(editref, () => setedit(false));

  const logouthandler = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');
      toast.success(data.message);
      navigate('/getstarted');
      setisauth(false);
      setuser(null);
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // All animations in useEffect
  useEffect(() => {
    // Slide down + fade in for user info

    if (inforef.current) {
      gsap.fromTo(
        inforef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
    }

    // Slide up + fade in for pins & boards
    if (pinsRef.current) {
      gsap.fromTo(
        pinsRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
      );
    }
    if (boardsRef.current) {
      gsap.fromTo(
        boardsRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.3 }
      );
    }

    
    
  }, []);



  useEffect(()=>{
    const tl=gsap.timeline()

    if (open && openref.current) {
      tl.fromTo(
        openref.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: "bounce.out" }
      );
    }
  
    if (edit && editref.current) {
      tl.fromTo(
        editref.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: "bounce.out" }
      );
    }
  
  },[open])

  return (
    
    <div className="flex flex-col overflow-hidden z-20 min-h-screen bg-[#0F0E15] items-center justify-start p-6 w-full relative">
      {/* User info */}
      <div ref={inforef} className="flex flex-col items-center relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 border-3 border-blue-600 flex items-center justify-center hover:scale-125 transition active:scale-200 duration-400 ease-out">
          {user?.image?.url ? (
            <img
              src={user.image.url}
              alt={user.name || 'profile'}
              className="w-full  h-full object-contain scale-125 bg-white  rounded-full hover:scale-140 transition"
              style={{ objectPosition: 'top center' }}
            />
          ) : (
            <span className="text-2xl text-white">{user?.name?.charAt(0)}</span>
          )}

          {/* Menu button */}
        
        </div>

        <h1 className="mt-4 text-md text-white font-bold text-center">{user.name}</h1>
        <p className="text-white text-sm mt-2 text-center">{user.email}</p>

        <button
          onClick={logouthandler}
          className="bg-orange-600 text-white font-bold px-4 py-2 rounded-xl mt-4 hover:bg-blue-700 transition active:scale-90  duration-200 ease-out"
        >
          Logout
        </button>
      </div>

      {/* Your Pins */}
      <div ref={pinsRef} className="w-full mt-6">
        <ProfilePreviewCard title="Your Pins" redirect="/mypins" />
      </div>

      {/* Boards Preview */}
      <div ref={boardsRef} className="w-full mt-6">
        <BoardsPreview />
      </div>



       
      {/* Dropdown menus */}
      {open && (
        <div ref={openref} className="absolute right-8 top-10 w-48 bg-[#1e96fc]/70 backdrop-blur-md p-4 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center space-y-4 text-white">
            <button onClick={() => { setopen(false); setedit(true); }}>Edit profile</button>
            <Link to="/updatepassword">
              <button>Update password</button>
            </Link>
          </div>
        </div>
      )}

      {edit && (
        <div ref={editref} className="absolute right-8 top-10 w-48 bg-[#1e96fc]/70 backdrop-blur-md p-4 rounded-2xl shadow-lg">
          <div className="flex flex-col space-y-4 text-white">
            <Link to="/editname" state={{ background: location }}>
              <button onClick={() => { setedit(false); setopen(false); }}>Edit Name</button>
            </Link>
            <Link to="/editdp" state={{ background: location }}>
              <button onClick={() => { setedit(false); setopen(false); }}>Edit Profile picture</button>
            </Link>
          </div>
        </div>
      )}

<CiMenuKebab
            onClick={() => setopen(prev => !prev)}
            className="text-2xl text-white cursor-pointer absolute top-6 right-2"
          />
    </div>
    
  );
};

export default Account;
