import { FC, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import DeveloperInfo from "@/components/DeveloperInfo";

const LoginPage: FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/events");
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#132f61] flex items-center justify-center border-2 border-[#AAFF28] mb-6">
          <span className="font-bold text-2xl text-[#AAFF28]">M</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-white">METE</span>
          <span className="neon-text-green">FIXA</span>
        </h1>
        <p className="text-gray-400 mb-4 max-w-md">
          O rolê de toda quinta - Gerencie a entrada de convidados em seus eventos com estilo.
        </p>
        <p className="text-sm text-[#AAFF28] mb-8">
          RAP, TRAP & FUNK
        </p>
        
        <div className="pixta-card bg-[#132f61] border border-[#1e3c70] rounded-lg p-6 max-w-sm w-full mb-8">
          <h2 className="text-lg font-medium mb-4">Acesse sua conta</h2>
          <p className="text-sm text-gray-400 mb-6">
            Faça login com sua conta Replit para gerenciar seus eventos.
          </p>
          
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#AAFF28] text-[#081b42] hover:bg-[#95e625] font-medium"
          >
            {isLoading ? "Carregando..." : "Entrar com Replit"}
          </Button>
          
          <div className="mt-6 flex items-center justify-center">
            <a 
              href="https://www.instagram.com/_metefixaa/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-[#AAFF28] flex items-center transition-colors"
            >
              <Instagram className="h-4 w-4 mr-1" />
              @_metefixaa
            </a>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Criado para organizadores de eventos e profissionais de portaria.</p>
        </div>
      </div>
      
      <footer className="p-4 border-t border-[#1e3c70] text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} METEFIXA - O melhor sistema para controle de entrada
      </footer>
      
      <DeveloperInfo />
    </div>
  );
};

export default LoginPage;