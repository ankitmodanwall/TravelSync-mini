import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// LIKE
export const toggleLike = async (tripId: string, userId: string, liked: boolean) => {
  const ref = doc(db, "trips", tripId);

  await updateDoc(ref, {
    likes: liked ? arrayRemove(userId) : arrayUnion(userId),
  });
};

// FOLLOW
export const toggleFollow = async (
  currentUser: string,
  targetUser: string,
  isFollowing: boolean
) => {
  const currentRef = doc(db, "users", currentUser);
  const targetRef = doc(db, "users", targetUser);

  await updateDoc(currentRef, {
    following: isFollowing ? arrayRemove(targetUser) : arrayUnion(targetUser),
  });

  await updateDoc(targetRef, {
    followers: isFollowing ? arrayRemove(currentUser) : arrayUnion(currentUser),
  });
};