import { FC } from "react";
import { type FilterType } from "@shared/schema";
import GuestCard from "@/components/GuestCard";
import EmptyState from "@/components/EmptyState";

interface GuestListProps {
  guests: any[];
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
  // Filtrar por busca
  const filteredBySearch = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filtrar por tipo
  const filteredGuests = filteredBySearch.filter(guest => {
    if (currentFilter === "all") return true;
    if (currentFilter === "entered") return guest.entered;
    return guest.ticketType === currentFilter;
  });
  
  if (filteredGuests.length === 0) {
    if (guests.length === 0) {
      return <EmptyState onAddFirstGuest={onAddFirstGuest} />;
    }
    
    return (
      <div className="text-center py-8 bg-[#132f61] rounded-lg border border-[#1e3c70]">
        <p className="text-gray-300 mb-2">Nenhum convidado encontrado</p>
        <p className="text-gray-400 text-sm">
          Tente modificar os filtros ou a busca
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
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