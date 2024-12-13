import { HomeIcon, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FurnitureFormData } from "../../types/furniture";
import { Message } from "../Message";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FeedbackForm from "./FeedbackForm";

// Types and Interfaces
interface ChatMessage {
  sender: string;
  text: string;
}

interface LocationState {
  furnitureResult: FurnitureFormData;
  priceAnalysis: any;
}

type TabType = "myynti" | "lahjoitus" | "kierrätys" | "kunnostus";

interface TabState {
  showInputField: boolean;
  isButtonsUsed: boolean;
}

interface TabStates {
  myynti: TabState;
  lahjoitus: TabState;
  kierrätys: TabState;
  kunnostus: TabState;
}

// Main Component
const ChatbotPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>("myynti");
  const [userMessage, setUserMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { furnitureResult, priceAnalysis } =
    (location.state as LocationState) || {
      furnitureResult: null,
      priceAnalysis: null,
    };

  const [tabStates, setTabStates] = useState<TabStates>({
    myynti: { showInputField: false, isButtonsUsed: false },
    lahjoitus: { showInputField: true, isButtonsUsed: true },
    kierrätys: { showInputField: true, isButtonsUsed: true },
    kunnostus: { showInputField: true, isButtonsUsed: true },
  });

  const [chatMessages, setChatMessages] = useState<
    Record<string, ChatMessage[]>
  >({
    myynti: [
      {
        sender: "bot",
        text: `Mikäli haluat myydä kalusteen, kalusteen myyntihinta on todennäköisesti ${priceAnalysis?.result.alin_hinta} - ${priceAnalysis?.result.korkein_hinta} euroa.

Suosittelen seuraavia myyntikanavia: ${priceAnalysis?.result.myyntikanavat}

Haluatko, että laadin sinulle myynti-ilmoitukseen pohjan?`,
      },
    ],
    lahjoitus: [
      {
        sender: "bot",
        text: "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, joihin kalusteen voi lahjoittaa.",
      },
    ],
    kierrätys: [
      {
        sender: "bot",
        text: "Kertoisitko osoitteesi, jotta voin ehdottaa sinua lähellä olevia paikkoja, jotka kierrättävät kalusteiden materiaaleja.",
      },
    ],
    kunnostus: [
      {
        sender: "bot",
        text: "Kertoisitko osoitteesi, jotta voin ehdottaa lähellä olevia yrityksiä, joissa kunnostetaan kalusteita.",
      },
    ],
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // API Handlers
  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${apiUrl}/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: furnitureResult?.requestId,
          review: {
            comment,
            rating,
          },
        }),
      });

      if (response.ok) {
        setIsFeedbackModalOpen(false);
        setIsDialogOpen(true);
      } else {
        console.error("Failed to send feedback:", response.status);
      }
    } catch (error) {
      console.error("Error while sending feedback:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;

    const currentMessage = userMessage;
    setUserMessage("");

    // Immediately update UI with user message
    setChatMessages((prev) => ({
      ...prev,
      [selectedTab]: [
        ...prev[selectedTab],
        { sender: "user", text: currentMessage },
      ],
    }));

    setTabStates((prev) => ({
      ...prev,
      [selectedTab]: { ...prev[selectedTab], showInputField: true },
    }));

    setIsLoading(true);
    const isFirstMessage = chatMessages[selectedTab].length === 1;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    try {
      let response;
      if (isFirstMessage && selectedTab !== "myynti") {
        const source = {
          lahjoitus: "donation",
          kierrätys: "recycle",
          kunnostus: "repair",
        }[selectedTab];

        response = await fetch(`${apiUrl}/api/location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: furnitureResult?.requestId,
            location: currentMessage,
            source,
          }),
        });
      } else {
        response = await fetch(`${apiUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: furnitureResult?.requestId,
            question: currentMessage,
          }),
        });
      }

      if (response.ok) {
        const data = await response.json();
        setChatMessages((prev) => ({
          ...prev,
          [selectedTab]: [
            ...prev[selectedTab],
            {
              sender: "bot",
              text:
                isFirstMessage && selectedTab !== "myynti"
                  ? data.result
                  : data.answer,
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Error during message send:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSalesPost = async () => {
    const message =
      "Luo myynti-ilmoitus kalusteelle, jossa annetaan selkeä ja myyvä kuvaus. Sisällytä ilmoitukseen kalusteen nimi, hinta, väri, koko(pituus, leveys, korkeus) ja kunto. Ilmoituksen tulee olla helposti luettavissa ja houkutteleva potentiaalisille ostajille, mutta älä käytä erikoismerkkejä, kuten tähtiä tai emojeita. Kirjoita ilmoitus asiallisella ja myyntiin sopivalla tyylillä.";
    await handleChatMessage(message);
  };

  const handleChatMessage = async (message: string) => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: furnitureResult?.requestId,
          question: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages((prev) => ({
          ...prev,
          [selectedTab]: [
            ...prev[selectedTab],
            { sender: "bot", text: data.answer },
          ],
        }));
      }
    } catch (error) {
      console.error("Error during message send:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="grid grid-cols-3 items-center">
            {/* Placeholder div joka vie 1/3 tilasta  */}
            <div></div>
            <CardTitle className="text-2xl font-bold text-center">
              KalusteArvioBotti
            </CardTitle>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => navigate("/")}>
                <HomeIcon className="h-4 w-4 mr-2" />
                Alkuun
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedTab}
            onValueChange={(value: string) => {
              if (
                value === "myynti" ||
                value === "lahjoitus" ||
                value === "kierrätys" ||
                value === "kunnostus"
              ) {
                setSelectedTab(value);
              }
            }}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="myynti">Myynti</TabsTrigger>
              <TabsTrigger value="lahjoitus">Lahjoitus</TabsTrigger>
              <TabsTrigger value="kierrätys">Kierrätys</TabsTrigger>
              <TabsTrigger value="kunnostus">Kunnostus</TabsTrigger>
            </TabsList>

            {Object.keys(tabStates).map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                <div
                  ref={chatContainerRef}
                  className="h-[400px] overflow-y-auto rounded-lg border bg-white p-4"
                >
                  <div className="flex flex-col space-y-2">
                    {chatMessages[tab].map((message, index) => (
                      <Message
                        key={index}
                        role={message.sender === "user" ? "user" : "assistant"}
                        content={message.text}
                      />
                    ))}
                  </div>
                </div>

                {!tabStates[tab as keyof typeof tabStates].showInputField &&
                  tab === "myynti" &&
                  chatMessages[tab].length === 1 &&
                  !tabStates[tab as keyof typeof tabStates].isButtonsUsed && (
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => {
                          setTabStates((prev) => ({
                            ...prev,
                            myynti: {
                              showInputField: true,
                              isButtonsUsed: true,
                            },
                          }));
                          handleCreateSalesPost();
                        }}
                        className="w-32"
                        disabled={isLoading}
                      >
                        Kyllä
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTabStates((prev) => ({
                            ...prev,
                            myynti: {
                              showInputField: true,
                              isButtonsUsed: true,
                            },
                          }));
                        }}
                        className="w-32"
                        disabled={isLoading}
                      >
                        Ei kiitos
                      </Button>
                    </div>
                  )}

                {tabStates[tab as keyof typeof tabStates].showInputField && (
                  <div className="flex gap-2 bg-white p-2 rounded-lg border">
                    <Input
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Kirjoita viestisi..."
                      className="flex-grow"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="shrink-0"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Lähetä"
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {chatMessages[selectedTab].length > 1 && (
            <div className="mt-4">
              <Button
                onClick={() => setIsFeedbackModalOpen(true)}
                variant="outline"
                className="w-full"
              >
                Anna palautetta
              </Button>
            </div>
          )}

          <FeedbackForm
            isOpen={isFeedbackModalOpen}
            onClose={() => setIsFeedbackModalOpen(false)}
            onSubmit={handleFeedbackSubmit}
          />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Kiitos palautteestasi</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotPage;
