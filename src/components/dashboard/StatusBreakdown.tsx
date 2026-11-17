import { Chip, Paper, Stack, Typography } from "@mui/material";
import { formatMoney, statusColors, statusLabels } from "@/lib/invoices";
import type { StatusTotal } from "@/lib/dashboard";

export default function StatusBreakdown({
  byStatus,
}: {
  byStatus: StatusTotal[];
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Facturas por estado
      </Typography>
      <Stack spacing={1}>
        {byStatus.map((item) => (
          <Stack
            key={item.status}
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Chip
              label={statusLabels[item.status]}
              color={statusColors[item.status]}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {item.count} {item.count === 1 ? "factura" : "facturas"}
            </Typography>
            <Typography
              sx={{ fontWeight: 600, minWidth: 110, textAlign: "right" }}
            >
              {formatMoney(item.total)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
