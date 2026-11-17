import { Box, Paper, Typography } from "@mui/material";
import { formatMoney, type InvoiceStatus } from "@/lib/invoices";
import type { DashboardSummary } from "@/lib/dashboard";

export default function SummaryCards({
  summary,
}: {
  summary: DashboardSummary;
}) {
  const ofStatus = (status: InvoiceStatus) =>
    summary.byStatus.find((s) => s.status === status)!;

  const cards = [
    { label: "Por cobrar", ...summary.receivable, color: "primary.main" },
    { label: "Vencido", ...summary.overdue, color: "error.main" },
    { label: "Pagadas", ...ofStatus("PAGADA"), color: "success.main" },
    { label: "Por enviar", ...ofStatus("POR_ENVIAR"), color: "text.primary" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
      }}
    >
      {cards.map((card) => (
        <Paper key={card.label} sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {card.label}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: card.color, my: 0.5 }}
          >
            {formatMoney(card.total)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {card.count} {card.count === 1 ? "factura" : "facturas"}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
