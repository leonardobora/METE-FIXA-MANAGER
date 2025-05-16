import { FC } from "react";
import { Guest, FilterType } from "@/types/Guest";
import GuestCard from "./GuestCard";
import EmptyState from "./EmptyState";
import { Search } from "lucide-react";

interface GuestListProps {
  guests: Guest[];
  searchQuery: string;
  currentFilter: FilterType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCheckIn: (id: string) => void;
  onAddFirstGuest: () => void;
}

const GuestList: FC<GuestListProps> = ({
  guests,
  searchQuery,
  currentFilter,
  onEdit,
  onDelete,
  onCheckIn,
  onAddFirstGuest
}) => {
  const filteredGuests = guests.filter(guest => {
    // Search filter
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    // Category filter
    if (currentFilter === "all") return true;
    if (currentFilter === "entered") return guest.entered;
    return guest.ticketType === currentFilter;
  });

  if (guests.length === 0) {
    return <EmptyState onAddFirstGuest={onAddFirstGuest} />;
  }

  if (filteredGuests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <Search className="h-16 w-16 text-gray-600 mb-4" />
        <h3 className="font-semibold text-xl mb-2">Nenhum resultado</h3>
        <p className="text-gray-400">Ajuste seus filtros ou faça uma nova busca</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {filteredGuests.map(guest => (
        <GuestCard 
          key={guest.id}
          guest={guest}
          onEdit={onEdit}
          onDelete={onDelete}
          onCheckIn={onCheckIn}
        />
      ))}
    </div>
  );
};

export default GuestList;
