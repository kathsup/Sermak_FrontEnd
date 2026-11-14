"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { api } from "@/lib/api";
import { changePasswordSchema } from "@/lib/validations/auth";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setServerError("");
    setSuccess(false);

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((i) => [i.path[0], i.message]),
        ),
      );
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      await api("/users/change-password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Error al cambiar la contraseña",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} noValidate spacing={2}>
      {serverError && <Alert severity="error">{serverError}</Alert>}
      {success && <Alert severity="success">Contraseña actualizada</Alert>}

      <TextField
        label="Contraseña actual"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        error={!!errors.currentPassword}
        helperText={errors.currentPassword}
      />
      <TextField
        label="Nueva contraseña"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={!!errors.newPassword}
        helperText={errors.newPassword}
      />
      <TextField
        label="Confirmar nueva contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        sx={{ alignSelf: "flex-start" }}
      >
        {submitting ? "Guardando..." : "Cambiar contraseña"}
      </Button>
    </Stack>
  );
}
