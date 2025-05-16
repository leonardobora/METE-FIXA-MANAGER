import { FC } from "react";
import { Guest } from "@/types/Guest";
import { Pencil, Trash2, Check } from "lucide-react";

interface GuestCardProps {
  guest: Guest;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCheckIn: (id: string) => void;
}

const GuestCard: FC<GuestCardProps> = ({ guest, onEdit, onDelete, onCheckIn }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Ticket type styling
  const getTicketTypeStyle = () => {
    switch (guest.ticketType) {
      case "pista":
        return "bg-[#FF2A6D] bg-opacity-20 text-[#FF2A6D] border-[#FF2A6D] shadow-neon-pink";
      case "vip":
        return "bg-[#B026FF] bg-opacity-20 text-[#B026FF] border-[#B026FF] shadow-neon-purple";
      case "cortesia":
        return "bg-[#FFD600] bg-opacity-20 text-[#FFD600] border-[#FFD600]";
      default:
        return "";
    }
  };

  return (
    <div className="guest-card fade-in mb-3 bg-[#0D2818] bg-opacity-80 rounded-xl p-4 shadow-lg border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{guest.name}</h3>
          <div className="flex items-center mt-1">
            <span className={`ticket-type-badge inline-block px-2 py-0.5 text-xs rounded-md ${getTicketTypeStyle()} mr-2`}>
              {guest.ticketType.charAt(0).toUpperCase() + guest.ticketType.slice(1)}
            </span>
            {guest.entered ? (
              <span className="text-[#00E676] text-sm flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Entrada confirmada
              </span>
            ) : (
              <span className="text-gray-400 text-sm">Aguardando entrada</span>
            )}
          </div>
        </div>
        <div className="flex">
          <button 
            onClick={() => onEdit(guest.id)} 
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Editar convidado"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button 
            onClick={() => onDelete(guest.id)} 
            className="p-2 text-gray-400 hover:text-[#FF3D00] transition-colors"
            aria-label="Remover convidado"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {guest.observations && (
        <div className="mt-3 text-sm text-gray-300">
          <p className="italic">{guest.observations}</p>
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
        <div className="text-xs text-gray-400">
          {guest.entered 
            ? `Entrada: ${formatTime(guest.entryTime!)}` 
            : `Cadastrado em ${formatDate(guest.createdAt)}`}
        </div>
        {guest.entered ? (
          <button 
            disabled
            className="px-4 py-1 bg-gray-700 bg-opacity-50 text-gray-300 rounded-lg border border-gray-600 cursor-not-allowed"
          >
            Já Entrou
          </button>
        ) : (
          <button 
            onClick={() => onCheckIn(guest.id)}
            className="px-4 py-1 bg-[#01FDF6] bg-opacity-20 text-[#01FDF6] rounded-lg border border-[#01FDF6] hover:bg-opacity-30 shadow-neon-blue transition-all duration-200"
          >
            Mete Ficha
          </button>
        )}
      </div>
    </div>
  );
};

export default GuestCard;
