import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
  TextField,
  useTheme,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const ChatbotPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [userMessage, setUserMessage] = useState(""); // State for input field
  const [chatMessages, setChatMessages] = useState([]); // State to hold chat messages
  const [showInputField, setShowInputField] = useState(false); // State to show input field
  const theme = useTheme();
  const location = useLocation();
  const { furnitureResult, priceAnalysis } = location.state || {
    furnitureResult: null,
    priceAnalysis: null,
  };

  const messages = {
    Myynti: [
      `Mikäli haluat myydä kalusteen, kalusteen myyntihinta on todennäköisesti ${priceAnalysis?.result.alin_hinta} - ${priceAnalysis?.result.korkein_hinta} euroa.`,
      `Suosittelen seuraavia myyntikanavia: ${priceAnalysis.result.myyntikanavat}`,
      "Haluatko, että laadin sinulle myynti-ilmoitukseen pohjan?",
    ],
    Lahjoitus: [
      "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, joihin kalusteen voi lahjoittaa.",
    ],
    Kierrätys: [
      "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, jotka kierrättävät kalusteiden materiaaleja.",
    ],
    Kunnostus: [
      "Kertoisitko osoitteesi, jotta voin ehdottaa lähellä olevia yrityksiä, joissa kunnostetaan kalusteita.",
    ],
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    setChatMessages([]); // Clear chat messages when switching tabs
    setShowInputField(false); // Hide the input field when switching tabs
  };

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      // Add the user message to chat messages
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userMessage }
      ]);
  
      try {
        // Make the API call to send userMessage and furnitureResult.requestId
        const response = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: furnitureResult.requestId,
            question: userMessage,
          }),
        });
  
        if (response.ok) {
          console.log("AI is generating answer")
          setUserMessage("");
          const data = await response.json();
          // Assuming the API response has the AI's message in data.message
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: data.answer },
          ]);
        } else {
          console.error("Failed to fetch AI response. Status:", response.status);
        }
      } catch (error) {
        console.error("Error during message send:", error);
      }

    }
  };
  

  const handleButtonClick = (response) => {
    setShowInputField(true); // Show the input field after button click
    setChatMessages([...chatMessages, { sender: "user", text: response }]);
  };

  const renderMessages = () => {
    const currentTab = Object.keys(messages)[selectedTab];
    const allMessages = [
      ...messages[currentTab].map((text) => ({ sender: "bot", text })),
      ...chatMessages,
    ];

    return allMessages.map((message, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "10px 15px",
            marginBottom: "10px",
            maxWidth: "75%",
            borderRadius: "15px",
            backgroundColor: message.sender === "user" ? "#d1c4e9" : "#e0f7fa",
          }}
        >
          <Typography variant="body1" sx={{ color: "black" }}>
            {message.text}
          </Typography>
        </Paper>
      </Box>
    ));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 500,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
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
      <Box
        sx={{
          padding: "20px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxHeight: "300px",
          overflowY: "auto",
          mt: 2,
        }}
      >
        {renderMessages()}
      </Box>

      {/* Kyllä ja Ei Kiitos napit */}
      {!showInputField && (
        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleButtonClick("KYLLÄ")}
          >
            KYLLÄ
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleButtonClick("EI KIITOS")}
          >
            EI KIITOS
          </Button>
        </Stack>
      )}

      {/* User Input Field */}
      {showInputField && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 2, width: "100%" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default ChatbotPage;
