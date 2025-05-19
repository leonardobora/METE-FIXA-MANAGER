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

interface TicketTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  editingTicketType: any | null;
  eventId: number;
}

// Esquema de validação com Zod
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.string().optional(),
  limit: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const TicketTypeForm: FC<TicketTypeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTicketType,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      limit: "",
    },
  });

  useEffect(() => {
    if (editingTicketType) {
      form.reset({
        name: editingTicketType.name,
        description: editingTicketType.description || "",
        price: editingTicketType.price?.toString() || "",
        limit: editingTicketType.limit?.toString() || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: "",
        limit: "",
      });
    }
  }, [editingTicketType, form]);

  const handleFormSubmit = (values: FormValues) => {
    // Converter o limite para um número se não estiver vazio
    const processedValues = {
      ...values,
      price: values.price ? parseFloat(values.price) : null,
      limit: values.limit ? parseInt(values.limit) : null,
    };
    
    onSubmit(processedValues);
    form.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur z-50 flex items-end justify-center md:items-center">
      <div className="bg-[#132f61] border border-[#1e3c70] rounded-t-xl md:rounded-xl w-full max-w-md p-6 animate-in slide-in-from-bottom md:slide-in-from-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {editingTicketType ? "Editar Tipo de Ingresso" : "Adicionar Tipo de Ingresso"}
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
                      placeholder="Ex: VIP, Pista, Cortesia"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do tipo de ingresso (opcional)"
                      className="bg-[#0f2650] border-[#1e3c70] text-white resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Preço (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
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
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Limite</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Opcional"
                        className="bg-[#0f2650] border-[#1e3c70] text-white"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {editingTicketType ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TicketTypeForm;