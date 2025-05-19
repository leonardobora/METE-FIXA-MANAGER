import { FC, useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import GuestFormModal from "@/components/GuestFormModal";
import EmptyState from "@/components/EmptyState";
import GuestList from "@/components/GuestList";
import FilterBar from "@/components/FilterBar";
import DeleteModal from "@/components/DeleteModal";
import CheckInModal from "@/components/CheckInModal";
import { type FilterType } from "@shared/schema";

const GuestsPage: FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<any>(null);
  const [guestToDelete, setGuestToDelete] = useState<any>(null);
  const [guestToCheckIn, setGuestToCheckIn] = useState<any>(null);
  
  // Carregar dados do evento
  const { data: event, isLoading: eventLoading, error: eventError } = useQuery({
    queryKey: ['/api/events/' + eventId],
    enabled: isAuthenticated && !!eventId,
  });
  
  // Carregar convidados do evento
  const { data: guests = [], isLoading: guestsLoading } = useQuery({
    queryKey: ['/api/events/' + eventId + '/guests'],
    enabled: isAuthenticated && !!eventId,
  });
  
  // Defina um tipo seguro para guests
  const safeGuests: any[] = Array.isArray(guests) ? guests : [];
  
  // Mutar para adicionar um convidado
  const addGuestMutation = useMutation({
    mutationFn: async (guestData: any) => {
      return apiRequest('/api/events/' + eventId + '/guests', {
        method: 'POST',
        body: JSON.stringify(guestData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Convidado adicionado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/events/' + eventId + '/guests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/' + eventId + '/stats'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o convidado",
        variant: "destructive",
      });
    },
  });
  
  // Mutar para atualizar um convidado
  const updateGuestMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest('/api/guests/' + id, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Convidado atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/events/' + eventId + '/guests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/' + eventId + '/stats'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o convidado",
        variant: "destructive",
      });
    },
  });
  
  // Mutar para fazer check-in de um convidado
  const checkInGuestMutation = useMutation({
    mutationFn: async (guestId: string) => {
      return apiRequest('/api/guests/' + guestId + '/check-in', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Check-in realizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/events/' + eventId + '/guests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/' + eventId + '/stats'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível realizar o check-in",
        variant: "destructive",
      });
    },
  });
  
  // Mutar para deletar um convidado
  const deleteGuestMutation = useMutation({
    mutationFn: async (guestId: string) => {
      return apiRequest('/api/guests/' + guestId, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Convidado removido com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/events/' + eventId + '/guests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/' + eventId + '/stats'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o convidado",
        variant: "destructive",
      });
    },
  });
  
  const handleAddGuest = (data: any) => {
    addGuestMutation.mutate(data);
    setIsGuestFormOpen(false);
  };
  
  const handleEditGuest = (data: any) => {
    if (editingGuest) {
      updateGuestMutation.mutate({ id: editingGuest.id, data });
      setEditingGuest(null);
      setIsGuestFormOpen(false);
    }
  };
  
  const handleCheckInGuest = () => {
    if (guestToCheckIn) {
      checkInGuestMutation.mutate(guestToCheckIn.id);
      setGuestToCheckIn(null);
    }
  };
  
  const handleDeleteGuest = () => {
    if (guestToDelete) {
      deleteGuestMutation.mutate(guestToDelete.id);
      setGuestToDelete(null);
    }
  };
  
  const openEditGuestModal = (id: string) => {
    const guest = safeGuests.find((g: any) => g.id === id);
    if (guest) {
      setEditingGuest(guest);
      setIsGuestFormOpen(true);
    }
  };
  
  const openDeleteGuestModal = (id: string) => {
    const guest = safeGuests.find((g: any) => g.id === id);
    if (guest) {
      setGuestToDelete(guest);
    }
  };
  
  const openCheckInModal = (id: string) => {
    const guest = safeGuests.find((g: any) => g.id === id);
    if (guest) {
      setGuestToCheckIn(guest);
    }
  };
  
  if (authLoading || eventLoading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl animate-pulse">
        <div className="h-8 bg-[#132f61] rounded mb-6 w-1/3"></div>
        <div className="h-32 bg-[#132f61] rounded mb-6"></div>
      </div>
    );
  }
  
  if (eventError || !event) {
    return (
      <div className="container mx-auto p-4 max-w-6xl text-center">
        <div className="bg-[#132f61] p-10 rounded-lg border border-[#1e3c70]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-4">
            <div className="text-4xl">i</div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Evento não encontrado</h2>
          <p className="text-gray-300 mb-6">
            O evento que você está procurando não existe ou foi removido.
          </p>
          <Link href="/events">
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB]">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Eventos
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return "Data não disponível";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Formatar horário
  const formatTime = (dateString: string) => {
    if (!dateString) return "Horário não disponível";
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Garantir que temos um evento válido
  const safeEvent = event || {};
  const eventDate = safeEvent.date ? new Date(safeEvent.date) : new Date();
  const isUpcoming = eventDate > new Date();
  
  return (
    <>
      <div className="container mx-auto p-4 max-w-6xl">
        <Link href="/events" className="text-[#3B82F6] hover:text-[#AAFF28] flex items-center mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para Eventos
        </Link>
        
        <div className="bg-[#132f61] rounded-lg border border-[#1e3c70] p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center mb-2 md:mb-0">
              <h1 className="text-xl font-bold text-white mr-3">{safeEvent.name || "Evento"}</h1>
              <Badge className={isUpcoming ? 'bg-[#AAFF28] text-[#081b42]' : 'bg-[#3B82F6]'}>
                {isUpcoming ? 'Próximo' : 'Realizado'}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Link href={`/events/${eventId}`}>
                <Button variant="outline" size="sm" className="border-[#3B82F6] text-[#3B82F6] hover:text-[#AAFF28] hover:border-[#AAFF28]">
                  Detalhes do Evento
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-gray-400">Data:</span> {formatDate(safeEvent.date)}
            </div>
            <div>
              <span className="text-gray-400">Horário:</span> {formatTime(safeEvent.date)} ({safeEvent.duration || 0}h)
            </div>
            <div>
              <span className="text-gray-400">Total de convidados:</span> {safeGuests.length}
            </div>
          </div>
        </div>
        
        <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar convidado..." 
              className="bg-[#132f61] border-[#1e3c70] text-white pl-10 focus:border-[#3B82F6]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            className="bg-[#AAFF28] text-[#081b42] hover:bg-[#88cc20]"
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
              onEdit={openEditGuestModal}
              onDelete={openDeleteGuestModal}
              onCheckIn={openCheckInModal}
              onAddFirstGuest={() => {
                setEditingGuest(null);
                setIsGuestFormOpen(true);
              }}
            />
          ) : (
            <EmptyState 
              onAddFirstGuest={() => {
                setEditingGuest(null);
                setIsGuestFormOpen(true);
              }}
            />
          )}
        </div>
      </div>
      
      <GuestFormModal 
        isOpen={isGuestFormOpen}
        onClose={() => {
          setIsGuestFormOpen(false);
          setEditingGuest(null);
        }}
        onSubmit={editingGuest ? handleEditGuest : handleAddGuest}
        editingGuest={editingGuest}
      />
      
      <DeleteModal 
        isOpen={!!guestToDelete}
        guestName={guestToDelete?.name || ""}
        onClose={() => setGuestToDelete(null)}
        onConfirm={handleDeleteGuest}
      />
      
      <CheckInModal 
        isOpen={!!guestToCheckIn}
        guestName={guestToCheckIn?.name || ""}
        onClose={() => setGuestToCheckIn(null)}
        onConfirm={handleCheckInGuest}
      />
    </>
  );
};

export default GuestsPage;