import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, LogIn, Loader2 } from "lucide-react";

interface AuthButtonProps {
  className?: string;
}

const AuthButton: FC<AuthButtonProps> = ({ className }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className={className} disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Carregando...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className={className}
        onClick={() => window.location.href = "/api/logout"}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    );
  }

  return (
    <Button 
      variant="default" 
      size="sm" 
      className={`bg-[#AAFF28] text-[#081b42] hover:bg-[#95e625] ${className}`}
      onClick={() => window.location.href = "/api/login"}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Entrar
    </Button>
  );
};

export default AuthButton;