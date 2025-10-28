import React, { useState } from "react";
import { Pindata } from "../context/pincontext";

const Like = ({ pin, userId }) => {
  const { likePin } = Pindata();
  const [liked, setLiked] = useState(pin?.likes?.includes(userId) || false);
  const [likesCount, setLikesCount] = useState(pin?.likes?.length || 0);
  const [animate, setAnimate] = useState(false);

  const handleLike = async () => {
    // ✅ Optimistic UI update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => newLiked ? prev + 1 : prev - 1);

    // ✅ Trigger animation
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    // 🐢 Background server update
    const data = await likePin(pin._id);
    if (data) {
      setLiked(data.liked);
      setLikesCount(data.likescount);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 text-2xl transition-all duration-300"
    >
      <span
        className={`transition-transform duration-300 ${
          animate ? "scale-125" : ""
        }`}
      >
        {liked ? "❤️" : "🤍"}
      </span>
      <span className=" text-white text-sm pr-3">{likesCount}</span>
    </button>
  );
};

export default Like;
