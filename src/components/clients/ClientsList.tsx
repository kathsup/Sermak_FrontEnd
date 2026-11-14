"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "@/lib/api";
import type { Client } from "@/lib/clients";
import ClientFormDialog from "./ClientFormDialog";

export default function ClientsList() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("all");
  const [version, setVersion] = useState(0);
  const [clients, setClients] = useState<Client[] | null>(null);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<{ client: Client | null } | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (active !== "all") params.set("active", active);

      api<Client[]>(`/clients?${params}`)
        .then((data) => {
          if (cancelled) return;
          setClients(data);
          setError("");
        })
        .catch((e) => {
          if (!cancelled) setError(e.message);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, active, version]);

  function handleSaved(msg: string) {
    setDialog(null);
    setMessage(msg);
    setVersion((v) => v + 1);
  }

  async function toggleActive(client: Client) {
    try {
      await api(`/clients/${client.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !client.active }),
      });
      handleSaved(client.active ? "Cliente desactivado" : "Cliente activado");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Buscar"
          placeholder="Empresa, contacto o correo"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          select
          label="Estado"
          size="small"
          value={active}
          onChange={(e) => setActive(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="true">Activos</MenuItem>
          <MenuItem value="false">Inactivos</MenuItem>
        </TextField>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ client: null })}
        >
          Nuevo Cliente
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {!error && !clients && <CircularProgress />}
      {!error && clients && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Empresa</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Día de pago</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">
                      No hay clientes
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.contactName}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.paymentDay}</TableCell>
                  <TableCell>
                    <Chip
                      label={client.active ? "Activo" : "Inactivo"}
                      color={client.active ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="Editar"
                      onClick={() => setDialog({ client })}
                    >
                      <EditIcon />
                    </IconButton>
                    <Tooltip title={client.active ? "Desactivar" : "Activar"}>
                      <IconButton
                        aria-label={client.active ? "Desactivar" : "Activar"}
                        onClick={() => toggleActive(client)}
                      >
                        {client.active ? (
                          <BlockIcon />
                        ) : (
                          <CheckCircleOutlineIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {dialog && (
        <ClientFormDialog
          client={dialog.client}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
