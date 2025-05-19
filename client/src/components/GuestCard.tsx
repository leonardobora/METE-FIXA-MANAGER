import { FC } from "react";
import { Check, Clock, Edit, Trash, User } from "lucide-react";
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
  
  const getTicketTypeBadge = (type: string) => {
    switch (type) {
      case "vip":
        return <Badge className="bg-[#AAFF28] text-[#081b42]">VIP</Badge>;
      case "pista":
        return <Badge className="bg-[#3B82F6]">Pista</Badge>;
      case "cortesia":
        return <Badge className="bg-purple-500">Cortesia</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };
  
  return (
    <Card className="bg-[#132f61] border-[#1e3c70] overflow-hidden hover:border-[#3B82F6] transition-all duration-300">
      <div className={`h-1 ${guest.entered ? 'bg-[#AAFF28]' : 'bg-[#3B82F6]'}`}></div>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white">{guest.name}</h3>
              {getTicketTypeBadge(guest.ticketType)}
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