import { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type FilterType } from "@shared/schema";

interface FilterBarProps {
  currentFilter: FilterType;
  setCurrentFilter: (filter: FilterType) => void;
}

export const FilterBar: FC<FilterBarProps> = ({ currentFilter, setCurrentFilter }) => {
  return (
    <Tabs value={currentFilter} className="w-full">
      <TabsList className="bg-[#132f61] border border-[#1e3c70] w-full flex overflow-x-auto">
        <TabsTrigger 
          value="all" 
          onClick={() => setCurrentFilter("all")}
          className="flex-1 data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
        >
          Todos
        </TabsTrigger>
        <TabsTrigger 
          value="pista" 
          onClick={() => setCurrentFilter("pista")}
          className="flex-1 data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
        >
          Pista
        </TabsTrigger>
        <TabsTrigger 
          value="vip" 
          onClick={() => setCurrentFilter("vip")}
          className="flex-1 data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
        >
          VIP
        </TabsTrigger>
        <TabsTrigger 
          value="cortesia" 
          onClick={() => setCurrentFilter("cortesia")}
          className="flex-1 data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white"
        >
          Cortesia
        </TabsTrigger>
        <TabsTrigger 
          value="entered" 
          onClick={() => setCurrentFilter("entered")}
          className="flex-1 data-[state=active]:bg-[#AAFF28] data-[state=active]:text-[#081b42]"
        >
          Presentes
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};