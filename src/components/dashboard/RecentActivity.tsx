import { Chip, Paper, Stack, Typography } from "@mui/material";
import { statusColors, statusLabels } from "@/lib/invoices";
import type { Movement } from "@/lib/dashboard";

// Fecha y hora en horario de Honduras, ej. "15/11/2026, 5:41 p. m."
const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("es-HN", {
    timeZone: "America/Tegucigalpa",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export default function RecentActivity({
  movements,
}: {
  movements: Movement[];
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Últimos movimientos
      </Typography>
      {movements.length === 0 && (
        <Typography color="text.secondary">Aún no hay movimientos</Typography>
      )}
      <Stack spacing={1.5}>
        {movements.map((movement) => (
          <Stack
            key={`${movement.invoiceId}-${movement.date}`}
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                Factura {movement.number} · {movement.clientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {movement.userName ? `${movement.userName} · ` : ""}
                {formatDateTime(movement.date)}
              </Typography>
            </div>
            <Chip
              label={statusLabels[movement.status]}
              color={statusColors[movement.status]}
              size="small"
            />
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
