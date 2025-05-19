import { FC, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import EventForm from "@/components/EventForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Event } from "@shared/schema";

const EventsPage: FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: events = [] as Event[], 
    isLoading: eventsLoading,
    error,
  } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    enabled: isAuthenticated,
  });

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // Combine date and time into a single Date object for backend
      const eventData = {
        name: data.name,
        date: new Date(`${data.date}T${data.time}`).toISOString(),
        duration: parseInt(data.duration),
        description: data.description || null,
      };

      console.log("Enviando dados do evento:", eventData);

      if (editingEvent) {
        await apiRequest(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso.",
        });
      } else {
        const response = await apiRequest("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
        console.log("Resposta da criação do evento:", response);
        toast({
          title: "Evento criado",
          description: "O evento foi criado com sucesso.",
        });
      }

      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o evento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-[#3B82F6] animate-spin mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-5xl mx-auto p-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meus Eventos</h1>
          <Button 
            onClick={handleAddEvent}
            className="bg-[#AAFF28] text-[#081b42] hover:bg-[#95e625]"
          >
            <Plus className="h-4 w-4 mr-2" /> Novo Evento
          </Button>
        </div>
        
        {eventsLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 text-[#3B82F6] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-[#132f61] rounded-lg border border-[#1e3c70]">
            <p className="text-red-400 mb-2">Erro ao carregar eventos</p>
            <p className="text-sm text-gray-400">Tente novamente mais tarde ou entre em contato com o suporte.</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center p-8 bg-[#132f61] rounded-lg border border-[#1e3c70]">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
            <p className="text-sm text-gray-400 mb-4">Crie seu primeiro evento para começar a gerenciar entradas.</p>
            <Button 
              onClick={handleAddEvent}
              className="bg-[#AAFF28] text-[#081b42] hover:bg-[#95e625]"
            >
              <Plus className="h-4 w-4 mr-2" /> Criar Evento
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event: Event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
      
      {isFormOpen && (
        <EventForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
};

export default EventsPage;