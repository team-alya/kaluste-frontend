import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import skyImage from "./sky.png";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/upload");
  };

  return (
    <Container maxWidth="sm" className="welcome-page">
      <Box className="content-box">
        <Typography variant="h3" className="title">
          KalusteArvio
        </Typography>

        <Box component="img" src={skyImage} alt="Logo" className="logo" />

        <Typography variant="h6" className="description">
          Hei! Olen KalusteArvioBotti. Autan sinua arvioimaan mitä sinun
          kannattaa tehdä tarpeettomalle tai huonokuntoiselle kalusteelle.
          <br />
          <br />
        </Typography>

        <Typography variant="h6" className="steps">
          1. Lataa kuva kalusteesta.
          <br />
          <br />
          2. Tarkista tekoälyn tunnistamat kalusteen tiedot.
          <br />
          <br />
          3. Tekoäly auttaa sinua arvioimaan mitä kalusteelle kannattaa tehdä.
          <br />
          <br />
        </Typography>

        <Button
          variant="contained"
          color="primary"
          className="start-button"
          onClick={handleStartClick}
        >
          ALOITA
        </Button>
      </Box>
    </Container>
  );
};

export default WelcomePage;
