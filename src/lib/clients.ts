import { z } from "zod";

export type Client = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  paymentDay: number;
  notes: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export const clientSchema = z.object({
  name: z.string().min(1, "Ingresa el nombre de la empresa"),
  contactName: z.string().min(1, "Ingresa la persona de contacto"),
  email: z.string().email("Correo inválido"),
  phone: z.string().min(1, "Ingresa el teléfono"),
  address: z.string().min(1, "Ingresa la dirección"),
  paymentDay: z
    .number({ message: "Ingresa el día de pago" })
    .int()
    .min(1, "Debe ser entre 1 y 31")
    .max(31, "Debe ser entre 1 y 31"),
  notes: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
