import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingGuest: any | null;
}

// Esquema de validação com Zod
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  ticketType: z.string().min(1, "Tipo de ingresso é obrigatório"),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const GuestFormModal: FC<GuestFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGuest,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ticketType: "pista",
      observations: "",
    },
  });

  useEffect(() => {
    if (editingGuest) {
      form.reset({
        name: editingGuest.name,
        ticketType: editingGuest.ticketType,
        observations: editingGuest.observations || "",
      });
    } else {
      form.reset({
        name: "",
        ticketType: "pista",
        observations: "",
      });
    }
  }, [editingGuest, form]);

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur z-50 flex items-end justify-center md:items-center">
      <div className="bg-[#132f61] border border-[#1e3c70] rounded-t-xl md:rounded-xl w-full max-w-md p-6 animate-in slide-in-from-bottom md:slide-in-from-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {editingGuest ? "Editar Convidado" : "Adicionar Convidado"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do convidado"
                      className="bg-[#0f2650] border-[#1e3c70] text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticketType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Tipo de Ingresso</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#0f2650] border-[#1e3c70] text-white">
                        <SelectValue placeholder="Selecione o tipo de ingresso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#132f61] border-[#1e3c70] text-white">
                      <SelectItem value="pista">Pista</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="cortesia">Cortesia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações (opcional)"
                      className="bg-[#0f2650] border-[#1e3c70] text-white resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[#3B82F6] text-[#3B82F6] hover:text-[#AAFF28] hover:border-[#AAFF28]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#AAFF28] text-[#081b42] hover:bg-[#88cc20]"
              >
                {editingGuest ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GuestFormModal;