import React, { useState } from "react";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import { CssBaseline, FormControlLabel, Box, Switch } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import ImageUploadPage from "./components/ImageUploadPage/ImageUploadPage";
import FurniConfirmPage from "./components/ConfirmationPage/ConfirmationPage";
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
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/upload" className="nav-link">
              Upload Image
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/confirmation" className="nav-link">
              Confirmation
            </Link>
          </div>
          <div className="toggle">
            {/* Switch to toggle theme */}
            <Box textAlign="center" margin={2}>
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={toggleTheme} />}
                label={darkMode ? "Theme 2" : "Theme 1"}
              />
            </Box>
          </div>
        </nav>

        {/* Routes */}
        <div>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/upload" element={<ImageUploadPage />} />
            <Route path="/confirmation" element={<FurniConfirmPage />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
