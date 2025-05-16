import { useState, useEffect } from "react";
import { Guest, InsertGuest } from "@/types/Guest";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "meteficha_guests";

export const useGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const { toast } = useToast();

  // Load guests from localStorage
  useEffect(() => {
    const storedGuests = localStorage.getItem(STORAGE_KEY);
    if (storedGuests) {
      try {
        setGuests(JSON.parse(storedGuests));
      } catch (error) {
        console.error("Failed to parse stored guests:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os convidados salvos.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Save guests to localStorage
  const saveGuests = (updatedGuests: Guest[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGuests));
      setGuests(updatedGuests);
    } catch (error) {
      console.error("Failed to save guests:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os convidados.",
        variant: "destructive",
      });
    }
  };

  // Add a new guest
  const addGuest = (guestData: InsertGuest) => {
    const newGuest: Guest = {
      id: Date.now().toString(),
      name: guestData.name,
      ticketType: guestData.ticketType,
      observations: guestData.observations,
      entered: false,
      createdAt: Date.now(),
      entryTime: null,
    };

    const updatedGuests = [...guests, newGuest];
    saveGuests(updatedGuests);
    
    toast({
      title: "Convidado adicionado",
      description: `${guestData.name} foi adicionado à lista.`,
    });
    
    return newGuest;
  };

  // Update an existing guest
  const updateGuest = (guestId: string, guestData: InsertGuest) => {
    const guestIndex = guests.findIndex(g => g.id === guestId);
    
    if (guestIndex === -1) {
      toast({
        title: "Erro",
        description: "Convidado não encontrado.",
        variant: "destructive",
      });
      return null;
    }

    // Preserve entry status and timestamps
    const updatedGuest: Guest = {
      ...guests[guestIndex],
      name: guestData.name,
      ticketType: guestData.ticketType,
      observations: guestData.observations,
    };

    const updatedGuests = [...guests];
    updatedGuests[guestIndex] = updatedGuest;
    
    saveGuests(updatedGuests);
    
    toast({
      title: "Convidado atualizado",
      description: `Informações de ${guestData.name} foram atualizadas.`,
    });
    
    return updatedGuest;
  };

  // Delete a guest
  const deleteGuest = (guestId: string) => {
    const guestToDelete = guests.find(g => g.id === guestId);
    
    if (!guestToDelete) {
      toast({
        title: "Erro",
        description: "Convidado não encontrado.",
        variant: "destructive",
      });
      return false;
    }

    const updatedGuests = guests.filter(g => g.id !== guestId);
    saveGuests(updatedGuests);
    
    toast({
      title: "Convidado removido",
      description: `${guestToDelete.name} foi removido da lista.`,
    });
    
    return true;
  };

  // Mark a guest as entered (check-in)
  const checkInGuest = (guestId: string) => {
    const guestIndex = guests.findIndex(g => g.id === guestId);
    
    if (guestIndex === -1) {
      toast({
        title: "Erro",
        description: "Convidado não encontrado.",
        variant: "destructive",
      });
      return null;
    }

    if (guests[guestIndex].entered) {
      toast({
        title: "Aviso",
        description: "Este convidado já entrou na festa.",
      });
      return null;
    }

    const updatedGuest: Guest = {
      ...guests[guestIndex],
      entered: true,
      entryTime: Date.now(),
    };

    const updatedGuests = [...guests];
    updatedGuests[guestIndex] = updatedGuest;
    
    saveGuests(updatedGuests);
    
    toast({
      title: "Entrada confirmada",
      description: `${updatedGuest.name} entrou na festa.`,
    });
    
    return updatedGuest;
  };

  // Get a guest by ID
  const getGuestById = (guestId: string) => {
    return guests.find(g => g.id === guestId) || null;
  };

  return {
    guests,
    addGuest,
    updateGuest,
    deleteGuest,
    checkInGuest,
    getGuestById,
  };
};
