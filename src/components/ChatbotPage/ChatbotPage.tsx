import React, { useState } from 'react';
import { Tabs, Tab, Typography, Box, Button, Stack } from '@mui/material';

const ChatbotPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Chatbot messages for each tab
  const messages = {
    Myynti: [
      "Mikäli haluat myydä kalusteen, kalusteen myyntihinta on todennäköisesti 50-100 euroa.",
      "Suosittelen seuraavia myyntikanavia: Tori, Mjuk",
      "Haluatko, että laadin sinulle myynti-ilmoitukseen pohjan?"
    ],
    Lahjoitus: [
      "Voit lahjoittaa kalusteen useisiin hyväntekeväisyysjärjestöihin.",
      "Esimerkiksi, Punainen Risti, Hope, tai paikalliset kierrätyskeskukset.",
      "Haluatko, että laadin sinulle lahjoitusilmoituksen pohjan?"
    ],
    Kierrätys: [
      "Kierrättämällä kalusteen autat ympäristöä.",
      "Suosittelemme viemään kalusteen lähimpään kierrätyskeskukseen.",
      "Tarvitsetko apua kierrätyskeskuksen löytämisessä?"
    ],
    Kunnostus: [
      "Kunnostamalla kalusteen voit pidentää sen käyttöikää.",
      "Voit kunnostaa itse tai hyödyntää paikallisia kunnostuspalveluja.",
      "Tarvitsetko vinkkejä kunnostamiseen tai kunnostuspalvelujen löytämiseen?"
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
      <Typography key={index} variant="body1" style={{ marginBottom: '10px' }}>
        {message}
      </Typography>
    ));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
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
      <Box sx={{ padding: '20px', textAlign: 'left' }}>
        {renderMessages()}
      </Box>

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
