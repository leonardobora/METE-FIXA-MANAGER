import { FC, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  Loader2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import EventForm from "@/components/EventForm";
import TicketTypeList from "@/components/TicketTypeList";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const EventDetailPage: FC = () => {
  const [, params] = useRoute("/events/:id");
  const eventId = params ? parseInt(params.id) : null;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    data: event, 
    isLoading,
    error
  } = useQuery({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });

  // Statistics data
  const { 
    data: stats = { 
      totalGuests: 0, 
      enteredGuests: 0, 
      ticketTypeCounts: {} 
    } 
  } = useQuery({
    queryKey: [`/api/events/${eventId}/stats`],
    enabled: !!eventId,
  });

  const handleEditEvent = () => {
    setIsFormOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventId) return;
    
    if (confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
      try {
        await apiRequest(`/api/events/${eventId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        toast({
          title: "Evento excluído",
          description: "O evento foi excluído com sucesso.",
        });
        
        // Redirect to events list
        window.location.href = "/events";
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o evento. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!eventId) return;
    
    try {
      const eventData = {
        name: data.name,
        date: new Date(`${data.date}T${data.time}`).toISOString(),
        duration: parseInt(data.duration),
        description: data.description,
      };

      await apiRequest(`/api/events/${eventId}`, {
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

      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Format date and time
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-[#3B82F6] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !event) {
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

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-4xl mx-auto p-4 py-6">
        <Link href="/events">
          <div className="flex items-center text-[#3B82F6] hover:text-[#AAFF28] mb-6 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Eventos
          </div>
        </Link>
        
        <div className="mb-6 bg-[#132f61] rounded-lg border border-[#1e3c70] overflow-hidden">
          <div className={`h-2 ${isUpcoming ? 'bg-[#AAFF28]' : 'bg-[#3B82F6]'}`}></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-white mr-3">{event.name}</h1>
                  <Badge className={isUpcoming ? 'bg-[#AAFF28] text-[#081b42]' : 'bg-[#3B82F6]'}>
                    {isUpcoming ? 'Próximo' : 'Realizado'}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {formatTime(event.date)} ({event.duration}h)
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {stats.totalGuests} convidados ({stats.enteredGuests} entraram)
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleEditEvent}
                  className="border-[#1e3c70] bg-[#0f2650] hover:bg-[#081b42] hover:text-white"
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteEvent}
                  className="border-red-800 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                </Button>
              </div>
            </div>
            
            {event.description && (
              <div className="mt-4 p-4 bg-[#0f2650] rounded-md text-gray-300">
                {event.description}
              </div>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="tickets">
          <TabsList className="bg-[#0f2650] border border-[#1e3c70]">
            <TabsTrigger value="tickets">Tipos de Ingresso</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tickets" className="pt-4">
            <TicketTypeList eventId={eventId} />
            
            <div className="mt-6 flex justify-end">
              <Link href={`/events/${eventId}/guests`}>
                <div className="px-4 py-2 bg-[#3B82F6] text-white rounded-md hover:bg-[#2563EB] flex items-center cursor-pointer">
                  <Users className="h-4 w-4 mr-2" /> Gerenciar Convidados
                </div>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-[#132f61] border-[#1e3c70]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total de Convidados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalGuests}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#132f61] border-[#1e3c70]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Convidados Presentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.enteredGuests}</div>
                  <div className="text-xs text-gray-500">
                    {stats.totalGuests > 0 
                      ? `${Math.round((stats.enteredGuests / stats.totalGuests) * 100)}% do total` 
                      : '0% do total'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#132f61] border-[#1e3c70]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Taxa de Presença</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalGuests > 0 
                      ? `${Math.round((stats.enteredGuests / stats.totalGuests) * 100)}%` 
                      : '0%'}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-[#132f61] border-[#1e3c70]">
              <CardHeader>
                <CardTitle className="text-md font-medium">Distribuição por Tipo de Ingresso</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.ticketTypeCounts).length === 0 ? (
                  <div className="py-4 text-center text-gray-400">
                    Não há dados de ingressos para este evento.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(stats.ticketTypeCounts).map(([type, count]) => (
                      <div key={type} className="flex items-center">
                        <div className="w-32 font-medium">{type}</div>
                        <div className="flex-1 mx-2">
                          <div className="h-3 bg-[#0f2650] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#3B82F6]" 
                              style={{ 
                                width: `${stats.totalGuests ? (count as number / stats.totalGuests * 100) : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-right">{count}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {isFormOpen && (
        <EventForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          editingEvent={event}
        />
      )}
    </div>
  );
};

export default EventDetailPage;