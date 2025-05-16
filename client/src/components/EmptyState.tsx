import { FC } from "react";

interface EmptyStateProps {
  onAddFirstGuest: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({ onAddFirstGuest }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
      <div className="w-16 h-16 mb-4 bg-[#0F351E] rounded-full flex items-center justify-center border-2 border-[#FF2A6D]">
        <span className="font-bold text-2xl text-white">8</span>
      </div>
      <h3 className="font-semibold text-xl mb-2">A lista está vazia</h3>
      <p className="text-gray-400 mb-4">Cadastre convidados usando o botão abaixo</p>
      <button 
        onClick={onAddFirstGuest}
        className="px-4 py-2 bg-[#FF2A6D] rounded-lg text-white font-medium shadow-neon-pink"
      >
        Adicionar primeiro convidado
      </button>
    </div>
  );
};

export default EmptyState;
