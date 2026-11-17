import { Typography } from "@mui/material";
import DashboardView from "@/components/dashboard/DashboardView";

export const instant = false;

export default function DashboardPage() {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <DashboardView />
    </>
  );
}
