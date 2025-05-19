import { FC, useState } from "react";
import { Instagram, Github, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const [isDevInfoOpen, setIsDevInfoOpen] = useState(false);
  
  return (
    <>
      <footer className="bg-[#081b42] border-t border-[#132f61] py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#132f61] flex items-center justify-center border-2 border-[#AAFF28] mr-3">
                <span className="font-bold text-[#AAFF28]">M</span>
              </div>
              <div>
                <p className="font-bold text-white">METEFIXA</p>
                <p className="text-xs text-gray-400">O rolê de toda quinta</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <a 
                href="https://www.instagram.com/_metefixaa/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-white hover:text-[#AAFF28] transition-colors mb-2"
              >
                <Instagram className="h-5 w-5 mr-2" />
                <span>@_metefixaa</span>
              </a>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-400">&copy; {currentYear} METEFIXA - RAP, TRAP & FUNK</p>
                <span className="text-xs text-gray-500">•</span>
                <button 
                  onClick={() => setIsDevInfoOpen(true)}
                  className="text-xs text-[#3B82F6] hover:text-[#AAFF28] transition-colors"
                >
                  Desenvolvedor
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={isDevInfoOpen} onOpenChange={setIsDevInfoOpen}>
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
              onClick={() => setIsDevInfoOpen(false)}
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

export default Footer;