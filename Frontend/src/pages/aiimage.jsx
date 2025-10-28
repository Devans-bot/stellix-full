import React, { useEffect, useRef, useState } from "react";
import BackButton from "../components/backbutton";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Generateload from "../components/generateloading";
import { Loadinganimation } from "../components/loading";


const Aiimage = () => {
  const [form, setForm] = useState({
    prompt: "",
    title: "",
    description: "",
  });

  const navigate=useNavigate()
  const boxref=useRef()
  const inputref=useRef()

  const [loading, setLoading] = useState(false);
  const [bloading, setbLoading] = useState(false);

  const [generatedImage, setGeneratedImage] = useState(null);

  // input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Generate image
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedImage(null);

    try {
      const res = await fetch("http://localhost:5000/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: form.prompt }),
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedImage(data.image); // store image url + id
      } else {
        console.error("Error:", data);
        alert(data.error || "Failed to generate image");
      }
    } catch (err) {
      console.error("Frontend error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Save pin
  const handleSubmit = async () => {
    if (!generatedImage) return alert("Generate an image first!");
    
    
    try {
      setbLoading(true)
      const res = await fetch("http://localhost:5000/api/ai/savePin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          pin: form.description,
          image: generatedImage,
        }),
      });

      const data = await res.json();
      toast.success("Pin saved ")
      navigate("/")
      if (res.ok) {
        
        setForm({ prompt: "", title: "", description: "" });
        setGeneratedImage(null);
      } else {
        console.error("Error:", data);
        alert(data.error || "Failed to save pin");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong while saving");
    }finally{
      setbLoading(false)
    }
  };



  useEffect(()=>{
    const tl=gsap.timeline()

    if(!generatedImage){
      tl.fromTo(
        inputref.current.children,
        {y:"-100%",opacity:0},
        {y:"1%",opacity:1,duration:0.4,ease:"back.out",stagger:0.1}
      )
    }

    if(generatedImage){
      tl.fromTo(
        inputref.current,
        {y:"-100%",opacity:0},
        {y:"1%",opacity:1,duration:0.4,ease:"back.out",stagger:0.1}
      )
    }
   
  },[loading])
  return (


 


<>   <div className="text-white min-h-screen z-90 bg-black flex flex-col items-center p-4 relative">
      <BackButton />

      {bloading ? (
  <Loadinganimation/> // show your loading overlay or spinner
) : (
  generatedImage && (
    <button
      onClick={handleSubmit}
      className="z-90 absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 text-md text-white p-3 rounded-lg shadow-lg"
    >
      Submit
    </button>
  )
)}


      <div className="mt-15 mb-4">
        <h2 className="text-lg font-semibold">Hey, post your imagination!</h2>
      </div>

      {generatedImage ? (
        <div className="flex flex-col items-center mt-5 gap-4">
          <img
            src={generatedImage.url}
            alt="AI generated"
            className="w-[300px] rounded-xl shadow-lg"
          />
          <div className="text-center">
            <h3 className="text-xl font-bold">{form.title || "Untitled"}</h3>
            <p className="text-sm text-gray-300">{form.description}</p>
          </div>
        </div>
      ) : (
        <form

         ref={inputref}
          onSubmit={handleGenerate}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <input
            type="text"
            name="prompt"
            value={form.prompt}
            onChange={handleChange}
            className="common-input"
            placeholder="Prompt"
            required
          />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="common-input"
            placeholder="Title"
          />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="common-input"
            placeholder="Description"
          />

        <button
            type="submit"
            disabled={loading}
          >
            {loading ? <Generateload/>: <><h3   className=" text-md font-bold bg-blue-500 w-3/7 text-white  py-2 rounded-lg hover:scale-115 transition duration-300"
              >Generate image</h3></>}
          </button>
        </form>
      )}
    </div>
</>
  );
};

export default Aiimage;
