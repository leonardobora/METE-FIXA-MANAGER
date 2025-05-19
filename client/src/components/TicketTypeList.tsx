import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TicketType } from "@shared/schema";
import TicketTypeForm from "./TicketTypeForm";
import { apiRequest } from "@/lib/queryClient";

interface TicketTypeListProps {
  eventId: number;
}

const TicketTypeList: FC<TicketTypeListProps> = ({ eventId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState<TicketType | null>(null);

  const { data: ticketTypes = [], isLoading, refetch } = useQuery<TicketType[]>({
    queryKey: [`/api/events/${eventId}/ticket-types`],
    enabled: !!eventId,
  });

  const handleAddTicketType = () => {
    setEditingTicketType(null);
    setIsFormOpen(true);
  };

  const handleEditTicketType = (ticketType: TicketType) => {
    setEditingTicketType(ticketType);
    setIsFormOpen(true);
  };

  const handleDeleteTicketType = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este tipo de ingresso?")) {
      try {
        await apiRequest(`/api/ticket-types/${id}`, {
          method: "DELETE"
        });
        refetch();
      } catch (error) {
        console.error("Erro ao excluir tipo de ingresso:", error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingTicketType) {
        // Update existing ticket type
        await apiRequest(`/api/ticket-types/${editingTicketType.id}`, {
          method: "PUT",
          body: JSON.stringify({ ...data })
        });
      } else {
        // Create new ticket type
        await apiRequest(`/api/events/${eventId}/ticket-types`, {
          method: "POST",
          body: JSON.stringify({ ...data, eventId })
        });
      }
      
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      console.error("Erro ao salvar tipo de ingresso:", error);
    }
  };

  return (
    <Card className="bg-[#132f61] border-[#1e3c70] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium">Tipos de Ingresso</CardTitle>
        <Button 
          size="sm" 
          className="bg-[#AAFF28] text-[#081b42] hover:bg-[#95e625]"
          onClick={handleAddTicketType}
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">Carregando...</div>
        ) : ticketTypes.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            Nenhum tipo de ingresso cadastrado para este evento.
          </div>
        ) : (
          <div className="space-y-2">
            {ticketTypes.map((ticketType: TicketType) => (
              <div 
                key={ticketType.id} 
                className="flex items-center justify-between p-3 bg-[#0f2650] border border-[#1e3c70] rounded-md"
              >
                <div>
                  <div className="font-medium">{ticketType.name}</div>
                  {ticketType.description && (
                    <div className="text-sm text-gray-400">{ticketType.description}</div>
                  )}
                </div>
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    onClick={() => handleEditTicketType(ticketType)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-gray-400 hover:text-[#FF3D00]"
                    onClick={() => handleDeleteTicketType(ticketType.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <TicketTypeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingTicketType={editingTicketType}
        eventId={eventId}
      />
    </Card>
  );
};

export default TicketTypeList;