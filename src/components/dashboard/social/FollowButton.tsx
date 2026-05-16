"use client";

import { useState } from "react";
import { toggleFollow } from "@/services/socialService";

export default function FollowButton({
  currentUser,
  targetUser,
  isFollowing,
}) {
  const [follow, setFollow] = useState(isFollowing);

  const handleFollow = async () => {
    await toggleFollow(currentUser, targetUser, follow);
    setFollow(!follow);
  };

  return (
    <button
      onClick={handleFollow}
      className="px-3 py-1 bg-blue-500 text-white rounded"
    >
      {follow ? "Unfollow" : "Follow"}
    </button>
  );
}