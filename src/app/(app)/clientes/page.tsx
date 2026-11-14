import { Typography } from "@mui/material";
import ClientsList from "@/components/clients/ClientsList";

export const instant = false;

export default function ClientesPage() {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Lista de Clientes
      </Typography>
      <ClientsList />
    </>
  );
}
