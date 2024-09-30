import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router components
import FurniConfirmPage from "./components/ConfirmationPage/ConfirmationPage";
import ImageUploadPage from "./components/ImageUploadPage/ImageUploadPage";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import { Button } from "@mui/material";
import "./App.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <Router>
      <div className={darkTheme ? "app dark-theme" : "app light-theme"}>
        <Button
          variant="contained"
          color="primary"
          className="theme-toggle-button"
          onClick={toggleTheme}
        >
          Vaihda Teemaa
        </Button>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<WelcomePage />} /> {/* Home route */}
          <Route path="/upload" element={<ImageUploadPage />} />{" "}
          <Route path="/confirmation" element={<FurniConfirmPage />} />{" "}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
