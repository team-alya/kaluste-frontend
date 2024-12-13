import { useState } from "react";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import { CssBaseline, Box, FormControlLabel, Switch } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import ImageUploadPage from "./components/ImageUploadPage/ImageUploadPage";
import FurniConfirmPage from "./components/ConfirmationPage/ConfirmationPage";
import ChatbotPage from "./components/ChatbotPage/ChatbotPage";
import { themeOptions, newThemeOptions } from "./theme";

import "./App.css"; // Custom styles for navigation bar

function App() {
  const [darkMode, setDarkMode] = useState(true); // State to manage theme mode

  const theme: Theme = createTheme(darkMode ? newThemeOptions : themeOptions);

  const toggleTheme = () => {
    setDarkMode(!darkMode); // Toggle between light and dark mode
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies global styles for current theme */}
      <div>
        <div className="toggle">
          {/* Switch to toggle theme */}
          <Box textAlign="center" margin={2}>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={toggleTheme} />}
              label={darkMode ? "Theme 2" : "Theme 1"}
            />
          </Box>
        </div>
      </div>
      {/* Routes */}
      <div>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/upload" element={<ImageUploadPage />} />
          <Route path="/confirmation" element={<FurniConfirmPage />} />
          <Route path="/chatbotpage" element={<ChatbotPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
