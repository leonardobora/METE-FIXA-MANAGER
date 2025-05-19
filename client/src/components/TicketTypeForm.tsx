import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TicketType } from "@shared/schema";

interface TicketTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  editingTicketType: TicketType | null;
  eventId: number;
}

const formSchema = z.object({
  name: z.string().min(1, "Nome do tipo de ingresso é obrigatório"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TicketTypeForm: FC<TicketTypeFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingTicketType,
  eventId
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  });

  useEffect(() => {
    if (editingTicketType) {
      form.reset({
        name: editingTicketType.name,
        description: editingTicketType.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [editingTicketType, form]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      eventId
    });
    form.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur z-50 flex items-end justify-center md:items-center">
      <div className="bg-[#132f61] rounded-t-xl md:rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#1e3c70] shadow-xl">
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-white">
              {editingTicketType ? "Editar Tipo de Ingresso" : "Adicionar Tipo de Ingresso"}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Fechar modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: VIP, Pista, Cortesia" 
                        {...field}
                        className="bg-[#0f2650] border-[#1e3c70]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição do tipo de ingresso (opcional)" 
                        rows={3}
                        {...field}
                        className="bg-[#0f2650] border-[#1e3c70] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                  className="border-[#1e3c70] bg-[#0f2650] hover:bg-[#081b42] hover:text-white"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#AAFF28] text-[#081b42] hover:bg-[#95e625]"
                >
                  {editingTicketType ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default TicketTypeForm;