import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Event } from "@shared/schema";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  editingEvent: Event | null;
}

const formSchema = z.object({
  name: z.string().min(1, "Nome do evento é obrigatório"),
  date: z.string().min(1, "Data do evento é obrigatória"),
  time: z.string().min(1, "Horário do evento é obrigatório"),
  duration: z.string().min(1, "Duração do evento é obrigatória"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EventForm: FC<EventFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingEvent 
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: "",
      time: "",
      duration: "3",
      description: "",
    }
  });

  // Set form values when editing an event
  useEffect(() => {
    if (editingEvent) {
      const eventDate = new Date(editingEvent.date);
      const dateString = eventDate.toISOString().split('T')[0];
      const timeString = `${eventDate.getHours().toString().padStart(2, '0')}:${eventDate.getMinutes().toString().padStart(2, '0')}`;
      
      form.reset({
        name: editingEvent.name,
        date: dateString,
        time: timeString,
        duration: editingEvent.duration.toString(),
        description: editingEvent.description || "",
      });
    } else {
      form.reset({
        name: "",
        date: "",
        time: "",
        duration: "3",
        description: "",
      });
    }
  }, [editingEvent, form]);

  const handleFormSubmit = (values: FormValues) => {
    // Combine date and time into a single Date object
    const submissionData = {
      ...values,
      dateTime: new Date(`${values.date}T${values.time}`),
    };
    onSubmit(submissionData);
    form.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur z-50 flex items-end justify-center md:items-center">
      <div className="bg-[#132f61] rounded-t-xl md:rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#1e3c70] shadow-xl">
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-white">
              {editingEvent ? "Editar Evento" : "Criar Evento"}
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
                    <FormLabel>Nome do Evento</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome do evento" 
                        {...field}
                        className="bg-[#0f2650] border-[#1e3c70]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
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
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field}
                          className="bg-[#0f2650] border-[#1e3c70]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (horas)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="24" 
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
                        placeholder="Descrição do evento (opcional)" 
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
                  {editingEvent ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;