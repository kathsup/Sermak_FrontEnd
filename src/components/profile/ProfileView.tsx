"use client";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "@/context/AuthContext";
import ChangePasswordForm from "./ChangePasswordForm";

export default function ProfileView() {
  const { user } = useAuth();

  return (
    <Stack spacing={3} sx={{ maxWidth: 600 }}>
      <Typography variant="h5">Mi perfil</Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Nombre
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Correo
        </Typography>
        <Typography>{user?.email}</Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Cambiar contraseña
        </Typography>
        <ChangePasswordForm />
      </Paper>
    </Stack>
  );
}
