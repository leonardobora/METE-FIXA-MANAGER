import { FC } from "react";
import { FilterType } from "@/types/Guest";

interface FilterBarProps {
  currentFilter: FilterType;
  setCurrentFilter: (filter: FilterType) => void;
}

const FilterBar: FC<FilterBarProps> = ({ currentFilter, setCurrentFilter }) => {
  return (
    <div className="px-4 py-2 bg-[#121212] bg-opacity-80 flex items-center overflow-x-auto whitespace-nowrap">
      <span className="text-sm text-gray-400 mr-2">Filtros:</span>
      <button 
        onClick={() => setCurrentFilter("all")}
        className={`px-3 py-1 mr-2 rounded-full text-sm border ${
          currentFilter === "all" 
            ? "bg-[#B026FF] bg-opacity-20 text-white border-[#B026FF] neon-glow-purple" 
            : "bg-[#121212] text-gray-300 border-gray-700"
        }`}
      >
        Todos
      </button>
      <button 
        onClick={() => setCurrentFilter("pista")}
        className={`px-3 py-1 mr-2 rounded-full text-sm border ${
          currentFilter === "pista" 
            ? "bg-[#B026FF] bg-opacity-20 text-white border-[#B026FF] neon-glow-purple" 
            : "bg-[#121212] text-gray-300 border-gray-700"
        }`}
      >
        Pista
      </button>
      <button 
        onClick={() => setCurrentFilter("vip")}
        className={`px-3 py-1 mr-2 rounded-full text-sm border ${
          currentFilter === "vip" 
            ? "bg-[#B026FF] bg-opacity-20 text-white border-[#B026FF] neon-glow-purple" 
            : "bg-[#121212] text-gray-300 border-gray-700"
        }`}
      >
        VIP
      </button>
      <button 
        onClick={() => setCurrentFilter("cortesia")}
        className={`px-3 py-1 mr-2 rounded-full text-sm border ${
          currentFilter === "cortesia" 
            ? "bg-[#B026FF] bg-opacity-20 text-white border-[#B026FF] neon-glow-purple" 
            : "bg-[#121212] text-gray-300 border-gray-700"
        }`}
      >
        Cortesia
      </button>
      <button 
        onClick={() => setCurrentFilter("entered")}
        className={`px-3 py-1 rounded-full text-sm border ${
          currentFilter === "entered" 
            ? "bg-[#B026FF] bg-opacity-20 text-white border-[#B026FF] neon-glow-purple" 
            : "bg-[#121212] text-gray-300 border-gray-700"
        }`}
      >
        Entraram
      </button>
    </div>
  );
};

export default FilterBar;
