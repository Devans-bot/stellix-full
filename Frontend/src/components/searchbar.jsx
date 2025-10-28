import React, { useRef, useState, useEffect } from "react";
import { FaSearch, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useOutsideClick from "./popupremove";
import gsap from "gsap";

const Searchbar = ({ isopen, setisopen }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("strict");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => setisopen(false));



  const overlayRef=useRef(null)
  const boxRef=useRef(null)
  const suggestionRef=useRef(null)

  useEffect(() => {
    if (!isopen) return;
  
    const tl = gsap.timeline();
  
    // 1️⃣ Fade in overlay
    tl.fromTo(
      overlayRef.current,
      { opacity: 0.5 },
      { opacity: 1, duration: 0.1}
    );
  
    // 2️⃣ Slide down search box
    tl.fromTo(
      boxRef.current,
      { scale:0.5, opacity: 0 },
      { scale:1, opacity: 1, duration: 0.3, ease: "bounce.out" }
    );
  
    // 3️⃣ Animate suggestion container after box is visible
    if (suggestionRef.current) {
      tl.fromTo(
        suggestionRef.current,
        { y: -20, opacity: 0 },
        { y: 1, opacity: 1, duration: 0.2, ease: "power2.out" }
      );
  
      // 4️⃣ Animate children of suggestions with stagger
     
    }
  }, [isopen, recentSearches]);
  



  
useEffect(() => {
  if (!isopen) return;
  if (suggestionRef.current && suggestionRef.current.children.length > 0) {
    gsap.fromTo(
      Array.from(suggestionRef.current.children),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out", stagger: 0.05, delay: 0.1 }
    );
  }
}, [suggestionRef.current, query, recentSearches, isopen]);
  // ✅ Load recent searches from localStorage

  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(saved);
  }, []);

  // ✅ Save to localStorage
  const saveRecentSearch = (keyword) => {
    if (!keyword.trim()) return;
    let updated = [keyword, ...recentSearches.filter((q) => q !== keyword)];
    if (updated.length > 5) updated = updated.slice(0, 5); // keep last 5
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // ✅ Fetch suggestions on typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch("/api/pins/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, mode, page: 1, limit: 5 }),
        });
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(delay);
  }, [query, mode]);

  // ✅ Handle main search
  const handleSearch = (keyword) => {
    if (!keyword.trim()) return;
    saveRecentSearch(keyword);
    navigate(`/searchpage?query=${encodeURIComponent(keyword)}&mode=${mode}`);
    setisopen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(query);
    }
  };

  if (!isopen) return null;



  return (
    <>
    


      {/* Mobile */}
      <div
      ref={overlayRef}
        className="soft-glass fixed inset-0 z-100 bg-black/70 pt-5 flex flex-col items-center justify-start px-4"
        onClick={() => setisopen(false)}
      >
        <div
          className="flex flex-col gap-2 w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input */}

          <div  ref={boxRef}className="flex items-center gap-2 w-full">
            <input
            
              type="text"
              placeholder="Search pins..."
              className="flex-1 common-input text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
            <button
              onClick={() =>
                setMode((prev) => (prev === "strict" ? "loose" : "strict"))
              }
              className={`absolute right-6 p-2 rounded-2xl text-xs ${
                mode === "strict"
                  ? "bg-blue-600 text-white"
                  : "bg-green-400 text-black"
              }`}
            >
              {mode === "strict" ? "S" : "L"}
            </button>
          </div>


          <div
          ref={suggestionRef}
            className="mt-2 w-full bg-white/90 frosted-glass rounded-md shadow">
           
   {recentSearches.length > 0 && !query && (
    
           <>
              <div 
              className="px-3 py-2 text-xs text-gray-500 flex items-center gap-2">
                <FaHistory /> Recent Searches
              </div>
              <div>
                 {recentSearches.map((item, idx) => (
                <div
                  key={idx}

                  onClick={() => handleSearch(item)}
                  className="py-2 px-4 flex items-center cursor-pointer hover:bg-gray-100"
                >
                  <FaSearch className="mr-2 text-gray-600" />
                  <span className="text-black">{item}</span>
                </div>
              ))}
             
             
            </div>
           </>
           
          )}
          
 </div>
         

      
          
        </div>
      </div>
    </>
  );
};

export default Searchbar;
