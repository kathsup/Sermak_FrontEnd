"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { api } from "@/lib/api";
import { clientSchema, type Client } from "@/lib/clients";

type Props = {
  client: Client | null;
  onClose: () => void;
  onSaved: (message: string) => void;
};

export default function ClientFormDialog({ client, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: client?.name ?? "",
    contactName: client?.contactName ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    address: client?.address ?? "",
    paymentDay: client ? String(client.paymentDay) : "",
    notes: client?.notes ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string[]>>>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

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

  async function handleSubmit() {
    const result = clientSchema.safeParse({
      ...form,
      paymentDay: Number(form.paymentDay),
    });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setSaving(true);
    try {
      await api(client ? `/clients/${client.id}` : "/clients", {
        method: client ? "PATCH" : "POST",
        body: JSON.stringify(result.data),
      });
      onSaved(client ? "Cliente actualizado" : "Cliente agregado exitosamente");
    } catch (e) {
      setServerError((e as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {client ? "Editar Cliente" : "Agregar Nuevo Cliente"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          <TextField {...field("name", "Nombre de la Empresa")} />
          <TextField {...field("contactName", "Persona de Contacto")} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField {...field("email", "Correo Electrónico")} />
            <TextField {...field("phone", "Teléfono")} />
          </Stack>
          <TextField
            {...field("address", "Dirección", { multiline: true, rows: 2 })}
          />
          <TextField
            {...field("paymentDay", "Día de pago (1-31)", { type: "number" })}
          />
          <TextField
            {...field("notes", "Notas (opcional)", {
              multiline: true,
              rows: 2,
            })}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          Guardar Cliente
        </Button>
      </DialogActions>
    </Dialog>
  );
}
