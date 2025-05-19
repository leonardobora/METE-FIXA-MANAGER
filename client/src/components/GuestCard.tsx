import { FC } from "react";
import { Check, Clock, Edit, Trash, User, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GuestCardProps {
  guest: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCheckIn: (id: string) => void;
}

const GuestCard: FC<GuestCardProps> = ({ guest, onEdit, onDelete, onCheckIn }) => {
  // Formatar data/hora
  const formatDateTime = (timestamp: number) => {
    if (!timestamp) return "Não entrou";
    
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  // Determinar o tipo de ingresso a ser exibido
  const ticketTypeName = guest.ticketTypeName || guest.ticketType?.name || "Sem tipo";
  
  // Obter cor do badge baseado no nome do tipo de ingresso (case-insensitive)
  const getTicketTypeBadgeClass = (typeName: string | undefined) => {
    if (!typeName) return "bg-gray-500"; // Default color for undefined ticket type
    const lowerName = typeName.toLowerCase();
    if (lowerName.includes('vip')) {
      return "bg-[#AAFF28] text-[#081b42]";
    } else if (lowerName.includes('pista')) {
      return "bg-[#3B82F6]";
    } else if (lowerName.includes('cortesia')) {
      return "bg-purple-500";
    } else {
      // Gerar uma cor baseada no nome para outros tipos
      const hue = Math.abs(typeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360);
      return `bg-[hsl(${hue},70%,50%)]`;
    }
  };
  
  return (
    <Card className="bg-[#132f61] border-[#1e3c70] overflow-hidden hover:border-[#3B82F6] transition-all duration-300">
      <div className={`h-1 ${guest.entered ? 'bg-[#AAFF28]' : 'bg-[#3B82F6]'}`}></div>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white">{guest.name}</h3>
              <Badge className={getTicketTypeBadgeClass(ticketTypeName)}>
                <Ticket className="w-3 h-3 mr-1" /> {ticketTypeName}
              </Badge>
              {guest.entered && (
                <Badge className="bg-[#AAFF28] text-[#081b42]">
                  <Check className="w-3 h-3 mr-1" /> Entrou
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col text-sm text-gray-400 gap-1">
              {guest.observations && (
                <p className="text-gray-300">{guest.observations}</p>
              )}
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {guest.entered 
                  ? `Entrada às ${formatDateTime(guest.entryTime)}` 
                  : "Ainda não entrou"}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end md:self-auto">
            <Button
              size="sm"
              variant="outline"
              className="border-[#3B82F6] text-[#3B82F6] hover:text-[#AAFF28] hover:border-[#AAFF28] p-2 h-auto"
              onClick={() => onEdit(guest.id)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="border-red-500 text-red-500 hover:text-red-400 hover:border-red-400 p-2 h-auto"
              onClick={() => onDelete(guest.id)}
            >
              <Trash className="w-4 h-4" />
            </Button>
            
            {!guest.entered && (
              <Button
                size="sm"
                className="bg-[#AAFF28] text-[#081b42] hover:bg-[#88cc20] px-3 py-1 h-9"
                onClick={() => onCheckIn(guest.id)}
              >
                <Check className="w-4 h-4 mr-1" /> Check-in
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestCard;