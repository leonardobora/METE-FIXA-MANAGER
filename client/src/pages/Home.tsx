import { useState } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import GuestList from "@/components/GuestList";
import AddGuestButton from "@/components/AddGuestButton";
import GuestFormModal from "@/components/GuestFormModal";
import CheckInModal from "@/components/CheckInModal";
import DeleteModal from "@/components/DeleteModal";
import { useGuests } from "@/hooks/useGuests";
import { Guest, InsertGuest, FilterType } from "@/types/Guest";

export default function Home() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  // Custom hook for guest management
  const { 
    guests, 
    addGuest, 
    updateGuest, 
    deleteGuest, 
    checkInGuest,
    getGuestById 
  } = useGuests();

  // Handlers
  const handleAddGuest = () => {
    setEditingGuest(null);
    setIsGuestFormOpen(true);
  };

  const handleEditGuest = (id: string) => {
    const guest = getGuestById(id);
    if (guest) {
      setEditingGuest(guest);
      setIsGuestFormOpen(true);
    }
  };

  const handleDeleteGuest = (id: string) => {
    const guest = getGuestById(id);
    if (guest) {
      setSelectedGuestId(id);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCheckInGuest = (id: string) => {
    const guest = getGuestById(id);
    if (guest && !guest.entered) {
      setSelectedGuestId(id);
      setIsCheckInModalOpen(true);
    }
  };

  const handleFormSubmit = (data: InsertGuest) => {
    if (editingGuest) {
      updateGuest(editingGuest.id, data);
    } else {
      addGuest(data);
    }
    setIsGuestFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedGuestId) {
      deleteGuest(selectedGuestId);
      setIsDeleteModalOpen(false);
      setSelectedGuestId(null);
    }
  };

  const handleConfirmCheckIn = () => {
    if (selectedGuestId) {
      checkInGuest(selectedGuestId);
      setIsCheckInModalOpen(false);
      setSelectedGuestId(null);
    }
  };

  // Get details of selected guest
  const selectedGuest = selectedGuestId ? getGuestById(selectedGuestId) : null;

  return (
    <div className="flex flex-col min-h-screen relative max-w-md mx-auto">
      <Header 
        totalGuests={guests.length} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
      />
      
      <FilterBar 
        currentFilter={currentFilter} 
        setCurrentFilter={setCurrentFilter} 
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-2">
        <GuestList 
          guests={guests}
          searchQuery={searchQuery}
          currentFilter={currentFilter}
          onEdit={handleEditGuest}
          onDelete={handleDeleteGuest}
          onCheckIn={handleCheckInGuest}
          onAddFirstGuest={handleAddGuest}
        />
      </main>
      
      <AddGuestButton onClick={handleAddGuest} />
      
      <GuestFormModal 
        isOpen={isGuestFormOpen}
        onClose={() => setIsGuestFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingGuest={editingGuest}
      />
      
      <CheckInModal 
        isOpen={isCheckInModalOpen}
        guestName={selectedGuest?.name || ""}
        onClose={() => setIsCheckInModalOpen(false)}
        onConfirm={handleConfirmCheckIn}
      />
      
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        guestName={selectedGuest?.name || ""}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
