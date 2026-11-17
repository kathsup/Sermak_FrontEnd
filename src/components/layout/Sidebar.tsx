"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Clientes", href: "/clientes", icon: <PeopleIcon /> },
  { label: "Facturas", href: "/facturas", icon: <ReceiptLongIcon /> },
  { label: "Suministros", href: "/suministros", icon: <Inventory2Icon /> },
  { label: "Informes", href: "/informes", icon: <AssessmentIcon /> },
  { label: "Configuración", href: "/configuracion", icon: <SettingsIcon /> },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "primary.dark",
        color: "primary.contrastText",
      }}
    >
      <Typography variant="h5" sx={{ p: 3, fontWeight: 700 }}>
        SERMAK
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            selected={pathname.startsWith(item.href)}
            onClick={onClose}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.16)" },
              "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, border: 0 },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: 0,
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
