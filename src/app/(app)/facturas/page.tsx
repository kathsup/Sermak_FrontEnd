import { Typography } from "@mui/material";
import InvoicesList from "@/components/invoices/InvoicesList";

export const instant = false;

export default function FacturasPage() {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Lista de Facturas
      </Typography>
      <InvoicesList />
    </>
  );
}
