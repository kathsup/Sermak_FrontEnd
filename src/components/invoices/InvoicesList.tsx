"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { api } from "@/lib/api";
import type { Client } from "@/lib/clients";
import {
  formatDate,
  formatMoney,
  statusColors,
  statusLabels,
  statusTransitions,
  type Invoice,
  type InvoiceStatus,
} from "@/lib/invoices";
import InvoiceFormDialog from "./InvoiceFormDialog";

// El back solo deja editar facturas en estos estados
const canEdit = (invoice: Invoice) =>
  invoice.status === "POR_ENVIAR" || invoice.status === "PENDIENTE";

const statusActionLabels: Record<InvoiceStatus, string> = {
  POR_ENVIAR: "Por enviar",
  PENDIENTE: "Marcar como enviada",
  PAGADA: "Marcar como pagada",
  VENCIDA: "Marcar como vencida",
  ANULADA: "Anular factura",
};

export default function InvoicesList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [clientId, setClientId] = useState("all");
  const [version, setVersion] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<{ invoice: Invoice | null } | null>(
    null,
  );
  const [menu, setMenu] = useState<{
    anchor: HTMLElement;
    invoice: Invoice;
  } | null>(null);
  const [pending, setPending] = useState<{
    invoice: Invoice;
    action: InvoiceStatus | "DELETE";
  } | null>(null);
  const [pendingError, setPendingError] = useState("");
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api<Client[]>("/clients")
      .then(setClients)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status !== "all") params.set("status", status);
      if (clientId !== "all") params.set("clientId", clientId);

      api<Invoice[]>(`/invoices?${params}`)
        .then((data) => {
          if (cancelled) return;
          setInvoices(data);
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
  }, [search, status, clientId, version]);

  function handleSaved(msg: string) {
    setDialog(null);
    setMessage(msg);
    setVersion((v) => v + 1);
  }

  function openConfirm(invoice: Invoice, action: InvoiceStatus | "DELETE") {
    setPendingError("");
    setPending({ invoice, action });
  }

  async function handleConfirm() {
    if (!pending) return;
    const { invoice, action } = pending;

    setWorking(true);
    setPendingError("");
    try {
      if (action === "DELETE") {
        await api(`/invoices/${invoice.id}`, { method: "DELETE" });
        handleSaved("Factura eliminada");
      } else {
        await api(`/invoices/${invoice.id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: action }),
        });
        handleSaved(
          `Factura marcada como ${statusLabels[action].toLowerCase()}`,
        );
      }
      setPending(null);
    } catch (e) {
      setPendingError((e as Error).message);
    } finally {
      setWorking(false);
    }
  }

  const pendingTitle =
    pending &&
    (pending.action === "DELETE"
      ? "Eliminar factura"
      : statusActionLabels[pending.action]);

  const pendingText =
    pending &&
    (pending.action === "DELETE"
      ? `¿Eliminar la factura ${pending.invoice.number}? Esta acción no se puede deshacer.`
      : `¿Cambiar la factura ${pending.invoice.number} a "${statusLabels[pending.action]}"?` +
        (statusTransitions[pending.action].length === 0
          ? " Es un estado final y ya no se podrá cambiar."
          : ""));

  const renderActions = (invoice: Invoice) => (
    <>
      {canEdit(invoice) && (
        <Tooltip title="Editar">
          <IconButton
            aria-label="Editar"
            onClick={() => setDialog({ invoice })}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
      {statusTransitions[invoice.status].length > 0 && (
        <Tooltip title="Cambiar estado">
          <IconButton
            aria-label="Cambiar estado"
            onClick={(e) => setMenu({ anchor: e.currentTarget, invoice })}
          >
            <SwapHorizIcon />
          </IconButton>
        </Tooltip>
      )}
      {invoice.status === "POR_ENVIAR" && (
        <Tooltip title="Eliminar">
          <IconButton
            aria-label="Eliminar"
            onClick={() => openConfirm(invoice, "DELETE")}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  return (
    <>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Buscar"
          placeholder="Número de factura"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          select
          label="Estado"
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">Todos</MenuItem>
          {Object.entries(statusLabels).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Cliente"
          size="small"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Todos</MenuItem>
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ invoice: null })}
        >
          Nueva Factura
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {!error && !invoices && <CircularProgress />}
      {!error && invoices && invoices.length === 0 && (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">No hay facturas</Typography>
        </Paper>
      )}
      {!error && invoices && invoices.length > 0 && (
        <>
          {/* Pantallas medianas y grandes: tabla */}
          <TableContainer
            component={Paper}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>N°</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Concepto</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell>Emisión</TableCell>
                  <TableCell>Día de pago</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.number}</TableCell>
                    <TableCell>{invoice.client.name}</TableCell>
                    <TableCell>{invoice.concept}</TableCell>
                    <TableCell align="right">
                      {formatMoney(invoice.amount)}
                    </TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[invoice.status]}
                        color={statusColors[invoice.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {renderActions(invoice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Celular: una tarjeta por factura */}
          <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
            {invoices.map((invoice) => (
              <Paper key={invoice.id} sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    Factura {invoice.number}
                  </Typography>
                  <Chip
                    label={statusLabels[invoice.status]}
                    color={statusColors[invoice.status]}
                    size="small"
                  />
                </Stack>
                <Typography>{invoice.client.name}</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {invoice.concept}
                </Typography>
                <Typography sx={{ fontWeight: 600, mt: 1 }}>
                  {formatMoney(invoice.amount)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Emisión: {formatDate(invoice.issueDate)} · Día de pago:{" "}
                  {formatDate(invoice.dueDate)}
                </Typography>
                <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
                  {renderActions(invoice)}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </>
      )}

      {menu && (
        <Menu open anchorEl={menu.anchor} onClose={() => setMenu(null)}>
          {statusTransitions[menu.invoice.status].map((next) => (
            <MenuItem
              key={next}
              onClick={() => {
                openConfirm(menu.invoice, next);
                setMenu(null);
              }}
            >
              {statusActionLabels[next]}
            </MenuItem>
          ))}
        </Menu>
      )}

      {pending && (
        <Dialog open onClose={() => setPending(null)} fullWidth maxWidth="xs">
          <DialogTitle>{pendingTitle}</DialogTitle>
          <DialogContent>
            {pendingError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {pendingError}
              </Alert>
            )}
            <DialogContentText>{pendingText}</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setPending(null)}>Cancelar</Button>
            <Button
              variant="contained"
              color={
                pending.action === "DELETE" || pending.action === "ANULADA"
                  ? "error"
                  : "primary"
              }
              onClick={handleConfirm}
              disabled={working}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {dialog && (
        <InvoiceFormDialog
          invoice={dialog.invoice}
          clients={clients}
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
