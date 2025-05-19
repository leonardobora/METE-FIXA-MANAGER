import { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type FilterType } from "@shared/schema";

interface FilterBarProps {
  currentFilter: FilterType;
  setCurrentFilter: (filter: FilterType) => void;
  availableFilters?: Array<{ id: string; name: string }>;
}

const FilterBar: FC<FilterBarProps> = ({ 
  currentFilter, 
  setCurrentFilter,
  availableFilters
}) => {
  // Filtros padrão se não forem fornecidos
  const filters = availableFilters || [
    { id: "all", name: "Todos" },
    { id: "pista", name: "Pista" },
    { id: "vip", name: "VIP" },
    { id: "cortesia", name: "Cortesia" },
    { id: "entered", name: "Presentes" }
  ];

  return (
    <Tabs value={currentFilter} className="w-full">
      <TabsList className="bg-[#132f61] border border-[#1e3c70] w-full flex overflow-x-auto">
        {filters.map(filter => (
          <TabsTrigger 
            key={filter.id}
            value={filter.id} 
            onClick={() => setCurrentFilter(filter.id as FilterType)}
            className={`flex-1 ${
              filter.id === "entered" 
                ? "data-[state=active]:bg-[#AAFF28] data-[state=active]:text-[#081b42]" 
                : "data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
            }`}
          >
            {filter.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default FilterBar;