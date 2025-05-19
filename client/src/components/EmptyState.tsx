import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface EmptyStateProps {
  onAddFirstGuest: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({ onAddFirstGuest }) => {
  return (
    <div className="text-center py-10 bg-[#132f61] rounded-lg border border-[#1e3c70]">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1e3c70] text-[#3B82F6] mb-4">
        <Ticket className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Nenhum convidado ainda</h3>
      <p className="text-gray-300 mb-6 max-w-md mx-auto">
        Adicione convidados para gerenciar a entrada no seu evento
      </p>
      <Button 
        onClick={onAddFirstGuest}
        className="bg-[#AAFF28] text-[#081b42] hover:bg-[#88cc20]"
      >
        Adicionar Primeiro Convidado
      </Button>
    </div>
  );
};

export default EmptyState;