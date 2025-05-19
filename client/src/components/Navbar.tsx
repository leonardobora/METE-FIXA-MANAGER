import { FC } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Home, UserCircle2, BarChart, Menu, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AuthButton from "@/components/AuthButton";

const Navbar: FC = () => {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const NavItems = () => (
    <>
      {isAuthenticated && (
        <>
          <div className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer ${location === '/events' ? 'bg-[#132f61] text-white' : 'text-gray-300 hover:bg-[#132f61] hover:text-white'}`} onClick={() => setLocation('/events')}>
            <Calendar className="h-4 w-4 mr-2" />
            <span>Eventos</span>
          </div>
          <div className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer ${location === '/stats' ? 'bg-[#132f61] text-white' : 'text-gray-300 hover:bg-[#132f61] hover:text-white'}`} onClick={() => setLocation('/events')}>
            <BarChart className="h-4 w-4 mr-2" />
            <span>Estatísticas</span>
          </div>
          <div className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer ${location === '/profile' ? 'bg-[#132f61] text-white' : 'text-gray-300 hover:bg-[#132f61] hover:text-white'}`} onClick={() => setLocation('/events')}>
            <UserCircle2 className="h-4 w-4 mr-2" />
            <span>Perfil</span>
          </div>
        </>
      )}
    </>
  );

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedTime = currentDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="sticky top-0 z-40 w-full bg-[#081b42] shadow-md border-b border-[#132f61]">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <div className="mr-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-[#132f61]">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-56 p-0 pt-10 bg-[#081b42] border-[#132f61]">
                <div className="flex flex-col gap-1 px-2">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setLocation('/events')}
          >
            <div className="w-9 h-9 rounded-full bg-[#132f61] flex items-center justify-center border-2 border-[#AAFF28]">
              <span className="font-bold text-[#AAFF28]">M</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              <span className="text-white">METE</span>
              <span className="neon-text-green">FIXA</span>
            </span>
          </div>
          
          <a 
            href="https://www.instagram.com/_metefixaa/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-4 text-sm text-gray-400 hover:text-[#AAFF28] hidden md:flex items-center transition-colors"
          >
            <Instagram className="h-4 w-4 mr-1" />
            @_metefixaa
          </a>
          <div className="hidden md:flex ml-6 items-center space-x-1">
            <NavItems />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right text-xs text-gray-400">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
          <AuthButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;