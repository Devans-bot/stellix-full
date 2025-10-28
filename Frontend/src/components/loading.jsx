import React from "react";

export const Loadinganimation=()=>{
    return (
        <div className="inline-block w-5 h-5 border-2 border-t-2 border-r-transparent border-white  rounded-full animate-spin">
        </div>
    );
}

export const Loading=()=>{
    return(
        <div className="flex bg-black items-center justify-center max-h-screen"
        >
      <div className="h-16 w-16 rounded-full border-4 border-blue-400 border-t-pink-400 animate-spin mb-4 shadow-[0_0_10px_rgba(255,255,255,0.5),0_0_20px_rgba(255,0,255,0.5)]"></div>
      </div>
    )
}

