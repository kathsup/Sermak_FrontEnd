"use client";

import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import { api } from "@/lib/api";
import type { DashboardSummary } from "@/lib/dashboard";
import DueSoonList from "./DueSoonList";
import RecentActivity from "./RecentActivity";
import StatusBreakdown from "./StatusBreakdown";
import SummaryCards from "./SummaryCards";

export default function DashboardView() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api<DashboardSummary>("/dashboard")
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!summary) return <CircularProgress />;

  return (
    <Stack spacing={2}>
      <SummaryCards summary={summary} />
      <StatusBreakdown byStatus={summary.byStatus} />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        }}
      >
        <DueSoonList invoices={summary.dueSoon} />
        <RecentActivity movements={summary.recentActivity} />
      </Box>
    </Stack>
  );
}
