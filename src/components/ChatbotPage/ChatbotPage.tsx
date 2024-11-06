import React, { useState } from "react";
import { Tabs, Tab, Typography, Box, Button, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";

const ChatbotPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const location = useLocation();
  const { furnitureResult, priceAnalysis, repairAnalysis } = location.state || { furnitureResult: null, priceAnalysis: null, repairAnalysis: null };

  // Chatbot messages with dynamic price information
  const messages = {
    Myynti: [
      `Mikäli haluat myydä kalusteen, kalusteen myyntihinta on todennäköisesti ${priceAnalysis?.result.alin_hinta} - ${priceAnalysis?.result.korkein_hinta} euroa.`,
      `Suosittelen seuraavia myyntikanavia: ${priceAnalysis.result.myyntikanavat}`,
      "Haluatko, että laadin sinulle myynti-ilmoitukseen pohjan?"
    ],
    Lahjoitus: [
      "Voit lahjoittaa kalusteen useisiin hyväntekeväisyysjärjestöihin.",
      "Esimerkiksi, Punainen Risti, Hope, tai paikalliset kierrätyskeskukset.",
      "Haluatko, että laadin sinulle lahjoitusilmoituksen pohjan?"
    ],
    Kierrätys: [
      `${repairAnalysis.result.kierrätys_ohjeet}`
    ],
    Kunnostus: [
      `${repairAnalysis.result.korjaus_ohjeet}`
    ],
    // Other tabs (Lahjoitus, Kierrätys, Kunnostus)...
  };

  // Handle tab change
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Render messages for the selected tab
  const renderMessages = () => {
    const currentTab = Object.keys(messages)[selectedTab];
    return messages[currentTab].map((message, index) => (
      <Typography key={index} variant="body1" style={{ marginBottom: "10px" }}>
        {message}
      </Typography>
    ));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 500, margin: "auto", textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        KalusteArvioBotti
      </Typography>

      {/* Tabs */}
      <Tabs value={selectedTab} onChange={handleChange} centered>
        <Tab label="Myynti" />
        <Tab label="Lahjoitus" />
        <Tab label="Kierrätys" />
        <Tab label="Kunnostus" />
      </Tabs>

      {/* Chatbot Messages */}
      <Box sx={{ padding: "20px", textAlign: "left" }}>{renderMessages()}</Box>

      {/* Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" color="primary">
          KYLLÄ
        </Button>
        <Button variant="outlined" color="primary">
          EI KIITOS
        </Button>
      </Stack>
    </Box>
  );
};

export default ChatbotPage;
