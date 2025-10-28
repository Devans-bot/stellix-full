import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaCheck } from 'react-icons/fa';

const Pincard = ({ pin, isSelected, onSelect }) => {
  const handleSelect = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
  };

  return (
    <div className="break-inside-avoid mb-4 w-full">
      <div className="relative group rounded-2xl overflow-hidden shadow">
        <img
          src={pin?.image?.url || "/placeholder.png"}
          alt={pin?.title || "Pin image"}
          className="w-full object-cover rounded-lg"
        />

        {/* Overlay for View Pin */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/pin/${pin._id}`}
            className="bg-red-500 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            View Pin
          </Link>
        </div>

        {/* ✅ + / ✔ Icon */}
        <button
          onClick={handleSelect}
          className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 transition z-50 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          {isSelected ? (
            <FaCheck className="text-green-600 text-lg" />
          ) : (
            <FaPlus className="text-blue-600 text-lg" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Pincard;
