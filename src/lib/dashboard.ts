import type { InvoiceStatus } from "@/lib/invoices";

export type StatusTotal = {
  status: InvoiceStatus;
  count: number;
  total: number;
};

export type CountTotal = {
  count: number;
  total: number;
};

export type DueSoonInvoice = {
  id: string;
  number: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
};

export type Movement = {
  invoiceId: string;
  number: string;
  clientName: string;
  status: InvoiceStatus;
  date: string;
  userName: string | null;
};

export type DashboardSummary = {
  byStatus: StatusTotal[];
  receivable: CountTotal;
  overdue: CountTotal;
  dueSoon: DueSoonInvoice[];
  recentActivity: Movement[];
};
