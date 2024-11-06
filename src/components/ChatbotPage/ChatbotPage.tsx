import React, { useState } from "react";
import { Tabs, Tab, Typography, Box, Button, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";

const ChatbotPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const location = useLocation();
  const { furnitureResult, priceAnalysis } = location.state || { furnitureResult: null, priceAnalysis: null};

  // Chatbot messages with dynamic price information
  const messages = {
    Myynti: [
      `Mikäli haluat myydä kalusteen, kalusteen myyntihinta on todennäköisesti ${priceAnalysis?.result.alin_hinta} - ${priceAnalysis?.result.korkein_hinta} euroa.`,
      `Suosittelen seuraavia myyntikanavia: ${priceAnalysis.result.myyntikanavat}`,
      "Haluatko, että laadin sinulle myynti-ilmoitukseen pohjan?",
    ],
    Lahjoitus: [
      "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, joihin kalusteen voi lahjoittaa."
    ],
    Kierrätys: [
      "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, jotka kierrättävät kalusteiden materiaaleja."
    ],
    Kunnostus: [
      "Kertoisitko osoitteesi, jotta voin ehdottaa lähellä olevia yrityksiä, joissa kunnostetaan kalusteita."
    ],
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
    <Box
      sx={{ width: "100%", maxWidth: 500, margin: "auto", textAlign: "center" }}
    >
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
