import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import Pincard from '../components/pincard';
import { Loading } from '../components/loading';
import Searchbar from '../components/searchbar';
import BackButton from '../components/backbutton';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const SearchPage = () => {

  const [issearchopen,setissearchopen]=useState(false)
  const queryParams = useQuery();
  const query = queryParams.get('query') || '';
  const mode = queryParams.get('mode') || 'strict';
  const [SearchInput,setSearchInput]=useState('')
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/pins/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, mode, page: 1, limit: 50 }),
        });
        const data = await res.json();
        setResults(data.results);
      } catch (err) {
        console.error('SearchPage API error:', err);
      }
      setLoading(false);
    };

    if (query.trim()) fetchResults();
  }, [query, mode]);

  if (loading) return <Loading />;

  if (!results || results.length === 0)
    return(<div className='h-screen bg-black'>
      
        <BackButton/> 
      <p className="text-center pt-10 text-white">No results found for "{query}"</p>
          </div>)


  // Masonry breakpoints same as Home
  const desktopview = {
    default: 5 ,
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

  return (
    <>

  
    <div className="hidden md:block w-10/12 relative top-7 left-37 overflow-hidden scrollbar-none min-h-screen">
      {/* Desktop view */}
      <BackButton/> 
      <input type="text" 
onClick={() => setissearchopen(true)}
onChange={(e) => setSearchInput(e.target.value)}
value={query}
        className='
           text-md text-white bg-black  h-13 mb-7 block w-8/12  ml-20 px-3 py-2 border-white border-2 rounded-xl  shadow-sm focus:outline-none sm:text-sm;
        ' />
        <h2 className="text-xs font-semibold text-white mb-4">
          Results for {query}
        </h2>
        <Masonry
          breakpointCols={desktopview}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {results.map((pin) => (
            <Pincard key={pin._id || pin.id} pin={pin} />
          ))}
        </Masonry>
      </div>

      {/* Mobile view */}
     
    <div className="  block md:hidden overlflow-auto scrollbar-none bg-[#0F0E15] h-screen  max-w-screen mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
    <input type="text" 
onClick={() => setissearchopen(true)}
onChange={(e) => setSearchInput(e.target.value)}
value={query}
        className='
           text-sm text-white bg-black  h-12 mb-7 block w-12/12    px-3 py-2 border-white border-2 rounded-xl  shadow-sm focus:outline-none sm:text-sm;
        ' />
        <h2 className="text-sm font-semibold text-white mb-4">
          Results for {query}
        </h2>
        <Masonry
          breakpointCols={mobileview}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {results.map((pin) => (
            <Pincard key={pin._id || pin.id} pin={pin} />
          ))}
        </Masonry>
      </div>
    {issearchopen && 
      ( <Searchbar isopen={issearchopen} setisopen={setissearchopen} />)
     }
    </>
  );
};

export default SearchPage;
