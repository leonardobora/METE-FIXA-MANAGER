import { FC, useEffect } from "react";
import { Guest, InsertGuest } from "@/types/Guest";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsertGuest) => void;
  editingGuest: Guest | null;
}

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  ticketType: z.enum(["pista", "vip", "cortesia"]),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const GuestFormModal: FC<GuestFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingGuest 
}) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ticketType: "pista",
      observations: "",
    }
  });

  const selectedTicketType = watch("ticketType");

  useEffect(() => {
    if (editingGuest) {
      setValue("name", editingGuest.name);
      setValue("ticketType", editingGuest.ticketType);
      setValue("observations", editingGuest.observations || "");
    } else {
      reset({
        name: "",
        ticketType: "pista",
        observations: "",
      });
    }
  }, [editingGuest, setValue, reset]);

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur z-50 flex items-end justify-center md:items-center">
      <div className="bg-[#0D2818] rounded-t-xl md:rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-800 shadow-xl">
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">
              {editingGuest ? "Editar Convidado" : "Adicionar Convidado"}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Fechar modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
              <input 
                id="name"
                {...register("name")}
                className="w-full bg-[#121212] bg-opacity-60 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B026FF]"
                placeholder="Nome do convidado"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-[#FF3D00]">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Ingresso</label>
              <div className="grid grid-cols-3 gap-2">
                <label className={`flex items-center justify-center bg-[#121212] bg-opacity-60 border ${selectedTicketType === "pista" ? "border-[#FF2A6D]" : "border-gray-700"} rounded-lg px-3 py-2 cursor-pointer hover:bg-opacity-70`}>
                  <input 
                    type="radio" 
                    value="pista" 
                    {...register("ticketType")} 
                    className="hidden" 
                  />
                  <span className="flex items-center justify-center w-full text-center">
                    <span className={`inline-block w-3 h-3 rounded-full border border-[#FF2A6D] mr-2 ${selectedTicketType === "pista" ? "bg-[#FF2A6D]" : "bg-transparent"}`}></span>
                    Pista
                  </span>
                </label>
                <label className={`flex items-center justify-center bg-[#121212] bg-opacity-60 border ${selectedTicketType === "vip" ? "border-[#B026FF]" : "border-gray-700"} rounded-lg px-3 py-2 cursor-pointer hover:bg-opacity-70`}>
                  <input 
                    type="radio" 
                    value="vip" 
                    {...register("ticketType")} 
                    className="hidden" 
                  />
                  <span className="flex items-center justify-center w-full text-center">
                    <span className={`inline-block w-3 h-3 rounded-full border border-[#B026FF] mr-2 ${selectedTicketType === "vip" ? "bg-[#B026FF]" : "bg-transparent"}`}></span>
                    VIP
                  </span>
                </label>
                <label className={`flex items-center justify-center bg-[#121212] bg-opacity-60 border ${selectedTicketType === "cortesia" ? "border-[#FFD600]" : "border-gray-700"} rounded-lg px-3 py-2 cursor-pointer hover:bg-opacity-70`}>
                  <input 
                    type="radio" 
                    value="cortesia" 
                    {...register("ticketType")} 
                    className="hidden" 
                  />
                  <span className="flex items-center justify-center w-full text-center">
                    <span className={`inline-block w-3 h-3 rounded-full border border-[#FFD600] mr-2 ${selectedTicketType === "cortesia" ? "bg-[#FFD600]" : "bg-transparent"}`}></span>
                    Cortesia
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="observations" className="block text-sm font-medium text-gray-300 mb-1">Observações</label>
              <textarea 
                id="observations"
                {...register("observations")}
                rows={3}
                className="w-full bg-[#121212] bg-opacity-60 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B026FF] resize-none"
                placeholder="Informações adicionais importantes"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 bg-[#121212] border border-gray-700 text-white rounded-lg hover:bg-opacity-80"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-[#01FDF6] border border-[#01FDF6] text-white rounded-lg shadow-neon-blue hover:bg-opacity-90"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestFormModal;
