import { Paper, Stack, Typography } from "@mui/material";
import { formatDate, formatMoney } from "@/lib/invoices";
import type { DueSoonInvoice } from "@/lib/dashboard";

export default function DueSoonList({
  invoices,
}: {
  invoices: DueSoonInvoice[];
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Por vencer (próximos 7 días)
      </Typography>
      {invoices.length === 0 && (
        <Typography color="text.secondary">
          No hay facturas por vencer
        </Typography>
      )}
      <Stack spacing={1.5}>
        {invoices.map((invoice) => (
          <Stack
            key={invoice.id}
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                Factura {invoice.number} · {invoice.clientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Día de pago: {formatDate(invoice.dueDate)}
              </Typography>
            </div>
            <Typography sx={{ fontWeight: 600 }}>
              {formatMoney(invoice.amount)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
