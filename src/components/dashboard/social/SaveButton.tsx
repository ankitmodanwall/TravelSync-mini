"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default function SaveButton({ userId, tripId, saved }) {
  const [isSaved, setIsSaved] = useState(saved);

  const toggleSave = async () => {
    const ref = doc(db, "users", userId);

    await updateDoc(ref, {
      savedTrips: isSaved ? arrayRemove(tripId) : arrayUnion(tripId),
    });

    setIsSaved(!isSaved);
  };

  return (
    <button onClick={toggleSave}>
      {isSaved ? "⭐ Saved" : "☆ Save"}
    </button>
  );
}