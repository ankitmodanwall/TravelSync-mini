import { useEffect, useState } from "react";
import { updateItinerary } from "@/services/itineraryService";

export const useItinerary = (initialData: any[], tripId: string) => {
  const [items, setItems] = useState(initialData);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateItinerary(tripId, items);
    }, 600);

    return () => clearTimeout(timer);
  }, [items]);

  return { items, setItems };
};