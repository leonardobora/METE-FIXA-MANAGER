import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, AlertCircle } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingGuest: any | null;
  eventId: number;
}

// Esquema de validação com Zod
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  ticketTypeId: z.number().optional(),
  ticketTypeName: z.string().min(1, "Tipo de ingresso é obrigatório"),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type TicketType = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  limit: number | null;
};

const GuestFormModal: FC<GuestFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGuest,
  eventId,
}) => {
  // Buscar tipos de ingresso disponíveis
  const { data: ticketTypes = [], isLoading: isLoadingTicketTypes } = useQuery({
    queryKey: ['/api/events', eventId, 'ticket-types'],
    enabled: !!eventId && isOpen,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ticketTypeId: undefined,
      ticketTypeName: "",
      observations: "",
    },
  });

  useEffect(() => {
    if (editingGuest) {
      form.reset({
        name: editingGuest.name,
        ticketTypeId: editingGuest.ticketTypeId,
        ticketTypeName: editingGuest.ticketTypeName || editingGuest.ticketType,
        observations: editingGuest.observations || "",
      });
    } else if (ticketTypes && ticketTypes.length > 0) {
      // Define o primeiro tipo de ingresso como padrão
      form.reset({
        name: "",
        ticketTypeId: ticketTypes[0].id,
        ticketTypeName: ticketTypes[0].name,
        observations: "",
      });
    } else {
      form.reset({
        name: "",
        ticketTypeId: undefined,
        ticketTypeName: "",
        observations: "",
      });
    }
  }, [editingGuest, form, ticketTypes, isOpen]);

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
  };

  if (!isOpen) return null;

  // Encontrar o tipo de ingresso selecionado para exibir informações adicionais
  const selectedTicketType = ticketTypes.find((type: TicketType) => 
    type.id === form.getValues().ticketTypeId
  );

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

        {ticketTypes.length === 0 && !isLoadingTicketTypes ? (
          <div className="bg-[#0f2650] p-4 rounded-md mb-4">
            <div className="flex items-center text-amber-400 mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p className="font-medium">Nenhum tipo de ingresso cadastrado</p>
            </div>
            <p className="text-gray-400 text-sm">
              Você precisa cadastrar pelo menos um tipo de ingresso antes de adicionar convidados.
              Vá para a página do evento e cadastre os tipos de ingresso na aba "Tipos de Ingresso".
            </p>
          </div>
        ) : (
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
                name="ticketTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tipo de Ingresso</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        const ticketType = ticketTypes.find((t: TicketType) => t.id === parseInt(value));
                        if (ticketType) {
                          form.setValue("ticketTypeName", ticketType.name);
                        }
                      }}
                      value={field.value?.toString()}
                      disabled={isLoadingTicketTypes}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#0f2650] border-[#1e3c70] text-white">
                          <SelectValue placeholder={isLoadingTicketTypes ? "Carregando..." : "Selecione o tipo de ingresso"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#132f61] border-[#1e3c70] text-white">
                        {isLoadingTicketTypes ? (
                          <div className="p-2 text-center text-gray-400">Carregando...</div>
                        ) : (
                          ticketTypes.map((type: TicketType) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                              {type.price ? ` - R$ ${type.price.toFixed(2)}` : ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    
                    {/* Descrição do tipo de ingresso selecionado */}
                    {selectedTicketType?.description && (
                      <p className="text-xs text-gray-400 mt-1">
                        {selectedTicketType.description}
                      </p>
                    )}
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
                  disabled={ticketTypes.length === 0}
                >
                  {editingGuest ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default GuestFormModal;