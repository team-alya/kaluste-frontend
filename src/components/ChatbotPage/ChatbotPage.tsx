import {
  Box,
  Button,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

interface ChatMessage {
  sender: string;
  text: string;
}

const ChatbotPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  
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

  // The first AI-"messages" shown on each tab
  const [chatMessages, setChatMessages] = useState<ChatMessage[][]>([
    [{sender: "bot", text: `Mikäli haluat myydä kalusteen, kalusteen myyntihinta on todennäköisesti ${priceAnalysis?.result.alin_hinta} - ${priceAnalysis?.result.korkein_hinta} euroa.
      Suosittelen seuraavia myyntikanavia: ${priceAnalysis.result.myyntikanavat}
      Haluatko, että laadin sinulle myynti-ilmoitukseen pohjan?`}], 
    [{sender: "bot", text: "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, joihin kalusteen voi lahjoittaa."}], 
    [{sender: "bot", text: "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, jotka kierrättävät kalusteiden materiaaleja."}], 
    [{sender: "bot", text: "Kertoisitko osoitteesi, jotta voin ehdottaa lähellä olevia yrityksiä, joissa kunnostetaan kalusteita."}]
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const messages = {
    Myynti: [
      
    ],
    Lahjoitus: [
      
    ],
    Kierrätys: [
      
    ],
    Kunnostus: [
      
    ],
  }

  // Change tabs
  const handleChange = (_event: unknown, newValue: React.SetStateAction<number>) => {
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

      // If the message is the first message in "lahjoitus", "kierrätys" or "kunnostus"
      // Expect the message to be the users location and send it to a different API-endpoint
      if (selectedTab != 0 && chatMessages[selectedTab].length === 1) {

        console.log("Message to api/location")
  
        // api/location needs the information of from which tab the users location is sent from
        let source = "";
        if (selectedTab === 1) {
          source = "donation"
        } else if (selectedTab === 2) {
          source = "recycle"
        } else if (selectedTab === 3) {
          source = "repair"
        }
  
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
          const response = await fetch(`${apiUrl}/api/location`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestId: furnitureResult.requestId,
              location: userMessage,
              source: source
            }),
          });
  
          if (response.ok) {
            const data = await response.json();
            setChatMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              updatedMessages[selectedTab] = [
                ...updatedMessages[selectedTab],
                { sender: "bot", text: data.result },
              ];
              return updatedMessages;
            });
          } else {
            console.error("Failed to fetch AI response. Status:", response.status);
          }
        } catch (error) {
          console.error("Error during message send:", error);
        }
      } else {

        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

          const response = await fetch(`${apiUrl}/api/chat`, {
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
    }
  };

  const handleButtonClick = async (response: string) => {
    if (response === "EI KIITOS") {
      // Just hide the buttons without sending any message
      setTabStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[selectedTab] = { showInputField: true, isButtonsUsed: true };
        return updatedStates;
      });
      return;
    }
    const message =
      "Luo myynti-ilmoitus kalusteelle, jossa annetaan selkeä ja myyvä kuvaus. Sisällytä ilmoitukseen kalusteen nimi, hinta, väri, koko(pituus, leveys, korkeus) ja kunto. Ilmoituksen tulee olla helposti luettavissa ja houkutteleva potentiaalisille ostajille, mutta älä käytä erikoismerkkejä, kuten tähtiä tai emojeita.Kirjoita ilmoitus asiallisella ja myyntiin sopivalla tyylillä.";

    setTabStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[selectedTab] = { showInputField: true, isButtonsUsed: true };
      return updatedStates;
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${apiUrl}/api/chat`, {
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
    const currentTabKey = Object.keys(messages)[selectedTab] as keyof typeof messages;
    const currentTabMessages = [
      ...messages[currentTabKey].map((text: unknown) => ({
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
            {message.text as React.ReactNode}
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
        maxWidth: 800,
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
          maxHeight: "325px",
          overflowY: "auto",
          mt: 2,
        }}
      >
        {renderMessages()}
      </Box>

      {!tabStates[selectedTab].showInputField && selectedTab === 0 && chatMessages[selectedTab].length === 1 && !tabStates[selectedTab].isButtonsUsed && (
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
