"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { api } from "@/lib/api";
import type { Client } from "@/lib/clients";
import { invoiceSchema, toDateInput, type Invoice } from "@/lib/invoices";

type Props = {
  invoice: Invoice | null;
  clients: Client[];
  onClose: () => void;
  onSaved: (message: string) => void;
};

export default function InvoiceFormDialog({
  invoice,
  clients,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState(() => ({
    number: invoice?.number ?? "",
    clientId: invoice?.clientId ?? "",
    concept: invoice?.concept ?? "",
    amount: invoice ? String(invoice.amount) : "",
    issueDate: toDateInput(invoice?.issueDate ?? new Date().toISOString()),
    dueDate: invoice ? toDateInput(invoice.dueDate) : "",
  }));
  const [errors, setErrors] = useState<Partial<Record<string, string[]>>>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  // Al crear solo se ofrecen clientes activos; al editar el cliente no cambia
  const clientOptions = invoice ? clients : clients.filter((c) => c.active);

  const field = (name: keyof typeof form, label: string, extra = {}) => ({
    label,
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [name]: e.target.value }),
    error: !!errors[name],
    helperText: errors[name]?.[0],
    fullWidth: true,
    ...extra,
  });

  const dateProps = {
    type: "date",
    slotProps: { inputLabel: { shrink: true } },
  };

  async function handleSubmit() {
    const result = invoiceSchema.safeParse({
      ...form,
      amount: Number(form.amount),
    });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setSaving(true);
    try {
      await api(invoice ? `/invoices/${invoice.id}` : "/invoices", {
        method: invoice ? "PATCH" : "POST",
        body: JSON.stringify(result.data),
      });
      onSaved(
        invoice ? "Factura actualizada" : "Factura agregada exitosamente",
      );
    } catch (e) {
      setServerError((e as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {invoice ? "Editar Factura" : "Agregar Nueva Factura"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField {...field("number", "Número de factura")} />
            <TextField
              {...field("clientId", "Cliente", {
                select: true,
                disabled: !!invoice,
              })}
            >
              {clientOptions.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField {...field("concept", "Concepto")} />
          <TextField {...field("amount", "Monto (L)", { type: "number" })} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField {...field("issueDate", "Fecha de emisión", dateProps)} />
            <TextField {...field("dueDate", "Día de pago", dateProps)} />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          Guardar Factura
        </Button>
      </DialogActions>
    </Dialog>
  );
}
