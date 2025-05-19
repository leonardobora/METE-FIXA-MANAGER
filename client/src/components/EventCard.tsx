import { FC } from "react";
import { Link } from "wouter";
import { Calendar, Clock, Ticket, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  totalGuests?: number;
}

const EventCard: FC<EventCardProps> = ({ event, totalGuests = 0 }) => {
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <Card className="bg-[#132f61] border-[#1e3c70] overflow-hidden hover:border-[#AAFF28] transition-all duration-300">
      <div className={`h-2 ${isUpcoming ? 'bg-[#AAFF28]' : 'bg-[#3B82F6]'}`}></div>
      <CardContent className="p-4">
        <div className="mb-3 flex justify-between items-start">
          <h3 className="font-bold text-lg text-white">{event.name}</h3>
          <Badge className={isUpcoming ? 'bg-[#AAFF28] text-[#081b42]' : 'bg-[#3B82F6]'}>
            {isUpcoming ? 'Próximo' : 'Realizado'}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            {formatDate(eventDate)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            {formatTime(eventDate)} ({event.duration}h)
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            {totalGuests} convidados
          </div>
        </div>
        
        {event.description && (
          <div className="mt-3 pt-3 border-t border-[#1e3c70] text-sm text-gray-300">
            {event.description.length > 100 
              ? `${event.description.substring(0, 100)}...` 
              : event.description}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-[#0f2650] p-3 border-t border-[#1e3c70] flex justify-between">
        <Link href={`/events/${event.id}`}>
          <a className="text-sm text-[#3B82F6] hover:text-[#AAFF28] transition-colors">
            Ver detalhes
          </a>
        </Link>
        <Link href={`/events/${event.id}/guests`}>
          <a className="text-sm px-3 py-1 bg-[#081b42] rounded-md border border-[#3B82F6] text-[#3B82F6] hover:text-[#AAFF28] hover:border-[#AAFF28] transition-colors flex items-center">
            <Ticket className="h-3 w-3 mr-1" /> Gerenciar entradas
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;