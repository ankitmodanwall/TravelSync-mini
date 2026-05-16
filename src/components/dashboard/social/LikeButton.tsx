"use client";

import { useState } from "react";
import { toggleLike } from "@/services/socialService";

export default function LikeButton({ tripId, userId, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);

  const handleLike = async () => {
    await toggleLike(tripId, userId, liked);
    setLiked(!liked);
  };

  return (
    <button
      onClick={handleLike}
      className="text-sm px-3 py-1 rounded bg-gray-100"
    >
      {liked ? "❤️ Liked" : "🤍 Like"}
    </button>
  );
}