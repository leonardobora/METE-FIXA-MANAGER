import { FC, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TicketTypeForm from "./TicketTypeForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, 
         AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
         AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TicketTypeListProps {
  eventId: number;
}

type TicketType = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  limit: number | null;
  eventId: number;
};

const TicketTypeList: FC<TicketTypeListProps> = ({ eventId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState<TicketType | null>(null);
  const [deletingTicketType, setDeletingTicketType] = useState<TicketType | null>(null);

  // Consulta para buscar os tipos de ingresso
  const { data: ticketTypes = [], isLoading } = useQuery({
    queryKey: ['/api/events', eventId, 'ticket-types'],
    enabled: !!eventId,
  });

  // Mutação para adicionar tipo de ingresso
  const addTicketTypeMutation = useMutation({
    mutationFn: async (newTicketType: any) => {
      return apiRequest(`/api/events/${eventId}/ticket-types`, {
        method: 'POST',
        body: JSON.stringify(newTicketType),
      });
    },
    onSuccess: () => {
      toast({
        title: "Tipo de ingresso adicionado",
        description: "O tipo de ingresso foi adicionado com sucesso.",
      });
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/events', eventId, 'ticket-types'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o tipo de ingresso. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao adicionar tipo de ingresso:", error);
    },
  });

  // Mutação para atualizar tipo de ingresso
  const updateTicketTypeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/ticket-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Tipo de ingresso atualizado",
        description: "O tipo de ingresso foi atualizado com sucesso.",
      });
      setIsFormOpen(false);
      setEditingTicketType(null);
      queryClient.invalidateQueries({ queryKey: ['/api/events', eventId, 'ticket-types'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o tipo de ingresso. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao atualizar tipo de ingresso:", error);
    },
  });

  // Mutação para excluir tipo de ingresso
  const deleteTicketTypeMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/ticket-types/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: "Tipo de ingresso excluído",
        description: "O tipo de ingresso foi excluído com sucesso.",
      });
      setDeletingTicketType(null);
      queryClient.invalidateQueries({ queryKey: ['/api/events', eventId, 'ticket-types'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o tipo de ingresso. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao excluir tipo de ingresso:", error);
    },
  });

  const handleSubmit = (data: any) => {
    if (editingTicketType) {
      updateTicketTypeMutation.mutate({ id: editingTicketType.id, data });
    } else {
      addTicketTypeMutation.mutate({ ...data, eventId });
    }
  };

  const handleEditTicketType = (ticketType: TicketType) => {
    setEditingTicketType(ticketType);
    setIsFormOpen(true);
  };

  const handleDeleteTicketType = (ticketType: TicketType) => {
    setDeletingTicketType(ticketType);
  };

  const confirmDelete = () => {
    if (deletingTicketType) {
      deleteTicketTypeMutation.mutate(deletingTicketType.id);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Tipos de Ingresso</h3>
        <Button
          onClick={() => {
            setEditingTicketType(null);
            setIsFormOpen(true);
          }}
          size="sm"
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[#132f61] rounded-lg"></div>
          ))}
        </div>
      ) : ticketTypes.length === 0 ? (
        <div className="bg-[#132f61] rounded-lg p-4 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-400">Nenhum tipo de ingresso cadastrado</p>
          <p className="text-sm text-gray-500 mt-1">
            Clique em "Adicionar" para criar tipos de ingresso para este evento
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ticketTypes.map((ticketType: TicketType) => (
            <div
              key={ticketType.id}
              className="bg-[#132f61] rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium text-white">{ticketType.name}</h4>
                  {ticketType.price !== null && ticketType.price !== undefined && (
                    <span className="ml-2 text-sm text-[#AAFF28]">
                      R$ {Number(ticketType.price).toFixed(2)}
                    </span>
                  )}
                  {ticketType.limit !== null && ticketType.limit !== undefined && (
                    <span className="ml-2 text-xs text-gray-400">
                      (Limite: {ticketType.limit})
                    </span>
                  )}
                </div>
                {ticketType.description && (
                  <p className="text-sm text-gray-400 mt-1">{ticketType.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#1e3c70]"
                  onClick={() => handleEditTicketType(ticketType)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-[#1e3c70]"
                  onClick={() => handleDeleteTicketType(ticketType)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <TicketTypeForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTicketType(null);
          }}
          onSubmit={handleSubmit}
          editingTicketType={editingTicketType}
          eventId={eventId}
        />
      )}

      <AlertDialog open={!!deletingTicketType} onOpenChange={(open) => !open && setDeletingTicketType(null)}>
        <AlertDialogContent className="bg-[#132f61] border-[#1e3c70] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tipo de ingresso</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o tipo de ingresso "{deletingTicketType?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#3B82F6] text-[#3B82F6] hover:text-[#AAFF28] hover:border-[#AAFF28]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TicketTypeList;