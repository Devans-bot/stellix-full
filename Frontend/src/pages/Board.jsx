import React, { useEffect, useRef, useState } from 'react';
import { boarddata } from '../context/boardcontext';
import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import gsap from 'gsap';

const Board = () => {
  const {newboard}= boarddata();
  const [name, setname] = useState('');
  const navigate=useNavigate()
  const boxref=useRef(null)
  const inputref=useRef(null)
   const btnref=useRef(null)
  const submitHandler = async(e) => {
    e.preventDefault();
    if (name.trim() === '') return;

    const boardId=await newboard(name);
    navigate(`/selectpins/${boardId}`,{state:{name}})
    setname(''); // clear input after submit
  };


  useEffect(()=>{
    const tl=gsap.timeline()

    tl.fromTo(
      boxref.current,
      {y:"-100%",opacity:0},
      {y:"10%",opacity:1,duration:0.2,stagger:0.4,ease:"bounce.out"}
    )
   
    tl.fromTo(
      inputref.current,
      {y:"-100%",opacity:0},
      {y:"40%",opacity:1,duration:0.2,ease:"bounce.out"}
    )
    tl.fromTo(
      btnref.current,
      {y:"-100%",opacity:0},
      {y:"40%",opacity:1,duration:0.2,ease:"bounce.out"}
    )
  },[navigate])


  return (
    <div className="h-screen fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-1/3 lg:w-2/3 bg-black p-3 pt-6">
      <div  className=" flex flex-col items-center gap-7">
        <h1 ref={boxref} className="text-white text-xl">Create Board</h1>

        <form ref={inputref}  onSubmit={submitHandler} className="w-full flex flex-col items-center gap-4">
          <input
          
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="rounded-xl text-white bg-black focus:outline-none focus:border-white border-2 border-white w-full p-5 placeholder-white placeholder:text-md pl-3 caret-white"
            placeholder="Board name"
          />
          <button 
          ref={btnref}
            type="submit"
            className="bg-white text-black px-6 py-3 rounded-xl hover:bg-white/40 transition"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default Board;
