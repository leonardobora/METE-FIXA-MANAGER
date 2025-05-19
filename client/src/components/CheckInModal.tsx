import { FC } from "react";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckInModalProps {
  isOpen: boolean;
  guestName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CheckInModal: FC<CheckInModalProps> = ({
  isOpen,
  guestName,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur z-50 flex items-end justify-center md:items-center">
      <div className="bg-[#132f61] border border-[#1e3c70] rounded-t-xl md:rounded-xl w-full max-w-md p-6 animate-in slide-in-from-bottom md:slide-in-from-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Check-in de Convidado</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1e3c70] text-[#AAFF28] mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <p className="text-gray-300">
            Confirmar check-in para <span className="font-bold text-white">{guestName}</span>?
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[#3B82F6] text-[#3B82F6] hover:text-[#AAFF28] hover:border-[#AAFF28]"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-[#AAFF28] text-[#081b42] hover:bg-[#88cc20]"
          >
            Confirmar Entrada
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;