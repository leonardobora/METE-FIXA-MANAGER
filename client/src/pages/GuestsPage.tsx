import { FC, useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Plus, 
  Loader2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import GuestList from "@/components/GuestList";
import GuestFormModal from "@/components/GuestFormModal";
import DeleteModal from "@/components/DeleteModal";
import CheckInModal from "@/components/CheckInModal";
import FilterBar from "@/components/FilterBar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FilterType } from "@shared/schema";

const GuestsPage: FC = () => {
  const [, params] = useRoute("/events/:id/guests");
  const eventId = params ? parseInt(params.id) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Estado para filtragem e pesquisa
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  
  // Estados para modais
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<any | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<any | null>(null);
  const [checkInGuest, setCheckInGuest] = useState<any | null>(null);

  // Consulta do evento
  const { 
    data: event = {},
    isLoading: eventLoading,
    error: eventError
  } = useQuery({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });

  // Consulta de tipos de ingresso
  const {
    data: ticketTypes = [],
    isLoading: ticketTypesLoading
  } = useQuery({
    queryKey: ['/api/events', eventId, 'ticket-types'],
    enabled: !!eventId,
  });

  // Consulta de convidados
  const {
    data: guests = [],
    isLoading: guestsLoading,
    refetch: refetchGuests
  } = useQuery({
    queryKey: [`/api/events/${eventId}/guests`],
    enabled: !!eventId,
  });

  // Mutação para adicionar convidado
  const addGuestMutation = useMutation({
    mutationFn: async (guestData: any) => {
      return apiRequest(`/api/events/${eventId}/guests`, {
        method: "POST",
        body: JSON.stringify(guestData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Convidado adicionado",
        description: "O convidado foi adicionado com sucesso.",
      });
      setIsGuestFormOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/guests`] });
      // Atualizar estatísticas do evento também
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/stats`] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o convidado. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao adicionar convidado:", error);
    },
  });

  // Mutação para atualizar convidado
  const updateGuestMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/guests/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Convidado atualizado",
        description: "As informações do convidado foram atualizadas com sucesso.",
      });
      setIsGuestFormOpen(false);
      setEditingGuest(null);
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/guests`] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o convidado. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao atualizar convidado:", error);
    },
  });

  // Mutação para excluir convidado
  const deleteGuestMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/guests/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Convidado excluído",
        description: "O convidado foi excluído com sucesso.",
      });
      setDeletingGuest(null);
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/guests`] });
      // Atualizar estatísticas do evento também
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/stats`] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o convidado. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao excluir convidado:", error);
    },
  });

  // Mutação para check-in de convidado
  const checkInGuestMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/guests/${id}/check-in`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Check-in realizado",
        description: "O check-in do convidado foi registrado com sucesso.",
      });
      setCheckInGuest(null);
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/guests`] });
      // Atualizar estatísticas do evento também
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/stats`] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível realizar o check-in. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao realizar check-in:", error);
    },
  });

  // Manipuladores de eventos
  const handleFormSubmit = (data: any) => {
    if (editingGuest) {
      updateGuestMutation.mutate({ id: editingGuest.id, data });
    } else {
      addGuestMutation.mutate(data);
    }
  };

  const handleEditGuest = (id: string) => {
    const guest = Array.isArray(guests) ? guests.find((g: any) => g.id === parseInt(id)) : null;
    if (guest) {
      setEditingGuest(guest);
      setIsGuestFormOpen(true);
    }
  };

  const handleDeleteGuest = (id: string) => {
    const guest = Array.isArray(guests) ? guests.find((g: any) => g.id === parseInt(id)) : null;
    if (guest) {
      setDeletingGuest(guest);
    }
  };

  const handleCheckInGuest = (id: string) => {
    const guest = Array.isArray(guests) ? guests.find((g: any) => g.id === parseInt(id)) : null;
    if (guest) {
      if (guest.entered) {
        toast({
          title: "Convidado já entrou",
          description: "Este convidado já realizou check-in anteriormente.",
        });
      } else {
        setCheckInGuest(guest);
      }
    }
  };

  const confirmDelete = () => {
    if (deletingGuest) {
      deleteGuestMutation.mutate(deletingGuest.id);
    }
  };

  const confirmCheckIn = () => {
    if (checkInGuest) {
      checkInGuestMutation.mutate(checkInGuest.id);
    }
  };

  // Determinar os filtros disponíveis com base nos tipos de ingresso
  const availableFilters = [
    { id: "all", name: "Todos" },
    ...(Array.isArray(ticketTypes) 
      ? ticketTypes.map((type: any) => ({ 
          id: type.name.toLowerCase(), 
          name: type.name 
        }))
      : []),
    { id: "entered", name: "Presentes" }
  ];

  // Filtrar convidados
  const filteredGuests = Array.isArray(guests) ? guests.filter((guest: any) => {
    // Filtro de busca
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro de tipo
    let matchesFilter = true;
    if (currentFilter === "entered") {
      matchesFilter = guest.entered === true;
    } else if (currentFilter !== "all") {
      const ticketTypeName = guest.ticketTypeName || guest.ticketType;
      matchesFilter = ticketTypeName && ticketTypeName.toLowerCase() === currentFilter;
    }
    
    return matchesSearch && matchesFilter;
  }) : [];

  // Para proteção contra erro
  const safeGuests = Array.isArray(filteredGuests) ? filteredGuests : [];

  if (eventLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-[#3B82F6] animate-spin" />
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container max-w-4xl mx-auto p-4 py-6">
          <Link href="/events">
            <a className="flex items-center text-[#3B82F6] hover:text-[#AAFF28] mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Eventos
            </a>
          </Link>
          
          <div className="text-center p-8 bg-[#132f61] rounded-lg border border-[#1e3c70]">
            <Info className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <h2 className="text-xl font-medium mb-2">Evento não encontrado</h2>
            <p className="text-gray-400 mb-4">O evento que você está procurando não existe ou foi removido.</p>
            <Link href="/events">
              <a className="inline-flex items-center px-4 py-2 bg-[#3B82F6] text-white rounded-md hover:bg-[#2563EB]">
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Eventos
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Formatação de data
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-4xl mx-auto p-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link href={`/events/${eventId}`}>
            <a className="flex items-center text-[#3B82F6] hover:text-[#AAFF28]">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para o Evento
            </a>
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{event.name}</h1>
          <p className="text-gray-400">{formatDate(event.date)}</p>
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Convidados</h2>
            <p className="text-gray-400 text-sm mt-1">
              Gerencie a lista de convidados para este evento
            </p>
          </div>
          
          <Button
            onClick={() => {
              setEditingGuest(null);
              setIsGuestFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Convidado
          </Button>
        </div>
        
        <FilterBar 
          currentFilter={currentFilter} 
          setCurrentFilter={setCurrentFilter}
          availableFilters={availableFilters}
        />
        
        <div className="mt-4">
          {guestsLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-[#132f61] rounded-lg"></div>
              ))}
            </div>
          ) : safeGuests.length > 0 ? (
            <GuestList
              guests={safeGuests}
              searchQuery={searchQuery}
              currentFilter={currentFilter}
              onEdit={handleEditGuest}
              onDelete={handleDeleteGuest}
              onCheckIn={handleCheckInGuest}
              onAddFirstGuest={() => {
                setEditingGuest(null);
                setIsGuestFormOpen(true);
              }}
            />
          ) : (
            <div className="bg-[#132f61] rounded-lg p-6 text-center">
              <Info className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum convidado encontrado</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery || currentFilter !== "all"
                  ? "Nenhum convidado corresponde aos seus filtros. Tente ajustar sua pesquisa ou filtros."
                  : "Você ainda não adicionou nenhum convidado para este evento."}
              </p>
              {searchQuery || currentFilter !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentFilter("all");
                  }}
                  className="border-[#3B82F6] text-[#3B82F6] hover:text-[#AAFF28] hover:border-[#AAFF28]"
                >
                  Limpar filtros
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setEditingGuest(null);
                    setIsGuestFormOpen(true);
                  }}
                  className="bg-[#AAFF28] text-[#081b42] hover:bg-[#88cc20]"
                >
                  <Plus className="h-4 w-4 mr-2" /> Adicionar primeiro convidado
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Modal de adicionar/editar convidado */}
      {isGuestFormOpen && (
        <GuestFormModal
          isOpen={isGuestFormOpen}
          onClose={() => {
            setIsGuestFormOpen(false);
            setEditingGuest(null);
          }}
          onSubmit={handleFormSubmit}
          editingGuest={editingGuest}
          eventId={eventId!}
        />
      )}
      
      {/* Modal de excluir convidado */}
      {deletingGuest && (
        <DeleteModal
          isOpen={!!deletingGuest}
          guestName={deletingGuest.name}
          onClose={() => setDeletingGuest(null)}
          onConfirm={confirmDelete}
        />
      )}
      
      {/* Modal de check-in */}
      {checkInGuest && (
        <CheckInModal
          isOpen={!!checkInGuest}
          guestName={checkInGuest.name}
          onClose={() => setCheckInGuest(null)}
          onConfirm={confirmCheckIn}
        />
      )}
    </div>
  );
};

export default GuestsPage;