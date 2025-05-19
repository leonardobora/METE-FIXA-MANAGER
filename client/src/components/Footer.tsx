import { FC } from "react";
import { Instagram } from "lucide-react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
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
            <p className="text-xs text-gray-400">&copy; {currentYear} METEFIXA - RAP, TRAP & FUNK</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;