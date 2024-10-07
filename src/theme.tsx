import { ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#00a6bb",
      contrastText: "rgba(255,255,255,0.87)",
    },
    secondary: {
      main: "#f50057",
    },
    text: {
      primary: "#000000",
    },
    background: {
      default: "#ffffff",
    },
  },
};

export const newThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#252525",
      paper: "#252525",
    },
  },
};
