import { FC } from "react";
import { Trash2 } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  guestName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: FC<DeleteModalProps> = ({ isOpen, guestName, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur z-50 flex items-center justify-center">
      <div className="bg-[#0D2818] rounded-xl w-full max-w-sm p-5 mx-4 border border-gray-800 shadow-xl">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#0F351E] rounded-full flex items-center justify-center border-2 border-[#FF3D00]">
            <Trash2 className="h-8 w-8 text-[#FF3D00]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Remover Convidado</h3>
          <p className="text-gray-300">
            Tem certeza que deseja remover <span className="font-medium text-white">{guestName}</span> da lista?
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#121212] border border-gray-700 text-white rounded-lg hover:bg-opacity-80 flex-1"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-[#FF3D00] border border-[#FF3D00] text-white rounded-lg shadow-sm hover:bg-opacity-90 flex-1"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
