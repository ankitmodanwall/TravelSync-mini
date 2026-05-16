import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const updateItinerary = async (tripId: string, itinerary: any[]) => {
  const ref = doc(db, "trips", tripId);
  await updateDoc(ref, { itinerary });
};