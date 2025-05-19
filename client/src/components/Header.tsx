import { FC } from "react";

interface HeaderProps {
  totalGuests: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: FC<HeaderProps> = ({ totalGuests, searchQuery, setSearchQuery }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0D2818] bg-opacity-95 backdrop-blur shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <div className="w-10 h-10 bg-[#0F351E] rounded-full flex items-center justify-center border-2 border-[#01FDF6]">
              <span className="font-bold text-white">8</span>
            </div>
          </div>
          <h1 className="font-bold text-2xl tracking-tight">
            <span className="text-white">Mete</span>
            <span className="neon-text-blue">Fixa</span>
          </h1>
        </div>
        <div className="text-sm">
          <div className="bg-[#121212] bg-opacity-40 px-3 py-1 rounded-full">
            <span className="text-[#01FDF6]">{totalGuests}</span> convidados
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 py-2 pb-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] bg-opacity-60 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B026FF]"
            placeholder="Buscar convidado por nome..."
          />
          <div className="absolute left-3 top-2.5 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
