import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ItineraryCard({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-white rounded-lg shadow mb-2 cursor-grab"
    >
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-500">{item.notes}</p>
    </div>
  );
}