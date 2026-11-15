import { z } from "zod";

export type InvoiceStatus =
  | "POR_ENVIAR"
  | "PENDIENTE"
  | "PAGADA"
  | "VENCIDA"
  | "ANULADA";

export type Invoice = {
  id: string;
  number: string;
  clientId: string;
  client: { name: string };
  concept: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  sentAt: string | null;
  paidAt: string | null;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const statusLabels: Record<InvoiceStatus, string> = {
  POR_ENVIAR: "Por enviar",
  PENDIENTE: "Pendiente",
  PAGADA: "Pagada",
  VENCIDA: "Vencida",
  ANULADA: "Anulada",
};

export const statusColors: Record<
  InvoiceStatus,
  "default" | "info" | "warning" | "success" | "error"
> = {
  POR_ENVIAR: "info",
  PENDIENTE: "warning",
  PAGADA: "success",
  VENCIDA: "error",
  ANULADA: "default",
};

// Mismas transiciones que el back; aquí solo sirven para decidir qué botones mostrar
export const statusTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
  POR_ENVIAR: ["PENDIENTE", "ANULADA"],
  PENDIENTE: ["PAGADA", "VENCIDA", "ANULADA"],
  VENCIDA: ["PAGADA", "ANULADA"],
  PAGADA: [],
  ANULADA: [],
};

const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresa la fecha");

export const invoiceSchema = z.object({
  number: z.string().min(1, "Ingresa el número de factura"),
  clientId: z.string().min(1, "Selecciona un cliente"),
  concept: z.string().min(1, "Ingresa el concepto"),
  amount: z
    .number({ message: "Ingresa el monto" })
    .positive("El monto debe ser mayor a 0"),
  issueDate: dateField,
  dueDate: dateField,
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const TIME_ZONE = "America/Tegucigalpa";

// "2026-11-10T06:00:00.000Z" -> "10/11/2026" (para mostrar)
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-HN", { timeZone: TIME_ZONE });
}

// "2026-11-10T06:00:00.000Z" -> "2026-11-10" (para llenar un input type="date")
export function toDateInput(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}

// 1500 -> "L 1,500.00"
export function formatMoney(amount: number) {
  return `L ${amount.toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
