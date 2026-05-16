"use client";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import ItineraryCard from "./ItineraryCard";
import { useItinerary } from "@/hooks/useItinerary";

export default function ItineraryBoard({ data, tripId }) {
  const { items, setItems } = useItinerary(data, tripId);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map(item => (
          <ItineraryCard key={item.id} item={item} />
        ))}
      </SortableContext>
    </DndContext>
  );
}