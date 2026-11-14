"use client";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    primary: { main: "#0367A6", dark: "#023859", contrastText: "#fff" },
    secondary: { main: "#025E73", contrastText: "#fff" },
    info: { main: "#0378A6" },
    background: { default: "#F4F7FA" },
  },
  typography: { fontFamily: roboto.style.fontFamily },
  shape: { borderRadius: 8 },
});

export default theme;
