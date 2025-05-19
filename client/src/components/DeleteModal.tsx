import { FC } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  guestName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: FC<DeleteModalProps> = ({
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
          <h2 className="text-xl font-bold text-white">Remover Convidado</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-300 mb-6">
          Tem certeza que deseja remover <span className="font-bold text-white">{guestName}</span> da lista de convidados? Esta ação não pode ser desfeita.
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[#3B82F6] text-[#3B82F6] hover:text-[#AAFF28] hover:border-[#AAFF28]"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;