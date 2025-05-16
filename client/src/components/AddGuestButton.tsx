import { FC } from "react";
import { Plus } from "lucide-react";

interface AddGuestButtonProps {
  onClick: () => void;
}

const AddGuestButton: FC<AddGuestButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-[#FF2A6D] flex items-center justify-center shadow-neon-pink hover:bg-opacity-90 active:scale-95 transition-all duration-200"
        aria-label="Adicionar convidado"
      >
        <Plus className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export default AddGuestButton;
