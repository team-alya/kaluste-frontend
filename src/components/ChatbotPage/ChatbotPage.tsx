import React, { useState, useEffect, useRef } from "react";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
  TextField,
} from "@mui/material";
import { useLocation } from "react-router-dom";

interface ChatMessage {
  sender: string;
  text: string;
}

const ChatbotPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[][]>([
    [], [], [], []
  ]);

  // Separate state for each tab's buttons and input field visibility
  const [tabStates, setTabStates] = useState([
    { showInputField: false, isButtonsUsed: false }, // Myynti
    { showInputField: true, isButtonsUsed: true },   // Lahjoitus
    { showInputField: true, isButtonsUsed: true },   // Kierrätys
    { showInputField: true, isButtonsUsed: true },   // Kunnostus
  ]);

  const location = useLocation();
  const { furnitureResult, priceAnalysis } = location.state || {
    furnitureResult: null,
    priceAnalysis: null,
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const handleChange = (_event: any, newValue: React.SetStateAction<number>) => {
    setSelectedTab(newValue);
  };

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      setChatMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[selectedTab] = [
          ...updatedMessages[selectedTab],
          { sender: "user", text: userMessage },
        ];
        return updatedMessages;
      });

      setUserMessage("");
      setTabStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[selectedTab].showInputField = true; // Show input field when a message is sent
        return updatedStates;
      });

      try {
        const response = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: furnitureResult.requestId,
            question: userMessage,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setChatMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[selectedTab] = [
              ...updatedMessages[selectedTab],
              { sender: "bot", text: data.answer },
            ];
            return updatedMessages;
          });
        } else {
          console.error("Failed to fetch AI response. Status:", response.status);
        }
      } catch (error) {
        console.error("Error during message send:", error);
      }
    }
  };

  const handleButtonClick = async (_response: string) => {
    const message =
      "Luo huomiota kiinnittävä, hyvin jaoteltu ja myyvä myynti-ilmoitus kyseiselle huonekalulle. Mainitse ilmoituksessa huonekalun ominaisuudet, mitat ja hinta.";

    setTabStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[selectedTab] = { showInputField: true, isButtonsUsed: true };
      return updatedStates;
    });

    setChatMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[selectedTab] = [
        ...updatedMessages[selectedTab],
        { sender: "user", text: message },
      ];
      return updatedMessages;
    });

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: furnitureResult.requestId,
          question: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[selectedTab] = [
            ...updatedMessages[selectedTab],
            { sender: "bot", text: data.answer },
          ];
          return updatedMessages;
        });
      } else {
        console.error("Failed to fetch AI response. Status:", response.status);
      }
    } catch (error) {
      console.error("Error during message send:", error);
    }
  };

  const renderMessages = () => {
    const currentTabMessages = [
      ...messages[Object.keys(messages)[selectedTab]].map((text: any) => ({
        sender: "bot",
        text,
      })),
      ...chatMessages[selectedTab],
    ];

    return currentTabMessages.map((message, index) => (
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

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

      <Tabs value={selectedTab} onChange={handleChange} centered>
        <Tab label="Myynti" />
        <Tab label="Lahjoitus" />
        <Tab label="Kierrätys" />
        <Tab label="Kunnostus" />
      </Tabs>

      <Box
        ref={chatContainerRef}
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

      {!tabStates[selectedTab].showInputField && selectedTab === 0 && chatMessages[selectedTab].length === 0 && !tabStates[selectedTab].isButtonsUsed && (
        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <Button variant="contained" color="primary" onClick={() => handleButtonClick("KYLLÄ")}>
            KYLLÄ
          </Button>
          <Button variant="outlined" color="primary" onClick={() => handleButtonClick("EI KIITOS")}>
            EI KIITOS
          </Button>
        </Stack>
      )}

      {tabStates[selectedTab].showInputField && (
        <Stack direction="row" spacing={2} justifyContent="center" mt={2} sx={{ width: "100%" }}>
          <TextField
            label="Write your message"
            variant="outlined"
            fullWidth
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default ChatbotPage;
