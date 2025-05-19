import { FC, useState } from "react";
import { Github, Linkedin, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeveloperInfo: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 rounded-full w-10 h-10 p-0 bg-[#132f61] hover:bg-[#1e3c70] shadow-lg z-50"
        aria-label="Informações do desenvolvedor"
      >
        <HelpCircle size={20} className="text-[#AAFF28]" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#081b42] border-[#132f61] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Informações do Desenvolvedor</DialogTitle>
            <DialogDescription className="text-gray-400">
              Aplicativo desenvolvido por Leonardo Bora
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-4">
              <Github className="text-white" size={20} />
              <a 
                href="https://github.com/leonardobora" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#01FDF6] hover:underline"
              >
                github.com/leonardobora
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Linkedin className="text-white" size={20} />
              <a 
                href="https://linkedin.com/in/leonardobora" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#01FDF6] hover:underline"
              >
                linkedin.com/in/leonardobora
              </a>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsOpen(false)}
              className="bg-[#132f61] hover:bg-[#1e3c70] text-white"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeveloperInfo;