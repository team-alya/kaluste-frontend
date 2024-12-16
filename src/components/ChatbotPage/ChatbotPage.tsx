import { HomeIcon, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createSalesPost,
  sendFeedBack,
  sendLocationRequest,
  sendMessage,
} from "../../services/chatService";
import { useFurnitureStore } from "../../stores/furnitureStore";
import { ChatMessage, TABS, TabType } from "../../types/chat";
import { Message } from "../Message";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FeedbackForm from "./FeedbackForm";
import { LocationSource } from "../../types/api";

// Main Component
const ChatbotPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get("tab") as TabType) || "myynti";
  console.log("currentTab:", currentTab);

  const [userMessage, setUserMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInput, setShowInput] = useState<Record<TabType, boolean>>({
    myynti: false,
    lahjoitus: true,
    kierrätys: true,
    kunnostus: true,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { furnitureResult, priceAnalysis } = useFurnitureStore();

  const initialMessages: Record<TabType, ChatMessage[]> = {
    myynti: [
      {
        sender: "bot",
        text: `Mikäli haluat myydä kalusteen, kalusteen myyntihinta on todennäköisesti ${priceAnalysis?.alin_hinta} - ${priceAnalysis?.korkein_hinta} euroa.

Suosittelen seuraavia myyntikanavia: ${priceAnalysis?.myyntikanavat?.join(", ")}

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
  };

  const [chatMessages, setChatMessages] = useState(initialMessages);
  useEffect(() => {
    console.log("chatMessages", chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    if (!furnitureResult) {
      navigate("/");
    }
  }, [furnitureResult, navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isLoading || !furnitureResult?.requestId) return;

    const currentMessage = userMessage;
    setUserMessage("");
    setIsLoading(true);

    try {
      setChatMessages((prev) => ({
        ...prev,
        [currentTab]: [
          ...prev[currentTab],
          { sender: "user", text: currentMessage },
        ],
      }));

      const isFirstMessage = chatMessages[currentTab].length === 1;

      if (isFirstMessage && currentTab !== "myynti") {
        const source: LocationSource = {
          lahjoitus: "donation",
          kierrätys: "recycle",
          kunnostus: "repair",
        }[currentTab] as LocationSource;

        const response = await sendLocationRequest(
          furnitureResult.requestId,
          currentMessage,
          source
        );
        console.log("Location response in component:", response);

        setChatMessages((prev) => ({
          ...prev,
          [currentTab]: [
            ...prev[currentTab],
            { sender: "bot", text: response.result },
          ],
        }));
      } else {
        const response = await sendMessage(
          furnitureResult.requestId,
          currentMessage
        );
        console.log("Chat response in component:", response);

        setChatMessages((prev) => ({
          ...prev,
          [currentTab]: [
            ...prev[currentTab],
            { sender: "bot", text: response.answer },
          ],
        }));
      }
    } catch (error) {
      console.error("Error during message send:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSalesPost = async () => {
    setShowInput((prev) => ({ ...prev, myynti: true }));
    if (!furnitureResult?.requestId) return;

    setIsLoading(true);
    try {
      const response = await createSalesPost(furnitureResult.requestId);

      setChatMessages((prev) => ({
        ...prev,
        myynti: [...prev.myynti, { sender: "bot", text: response.answer }],
      }));
    } catch (error) {
      console.error("Error creating sales post:", error);
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

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    if (!furnitureResult?.requestId) {
      console.error("No requestId available");
      return;
    }

    try {
      const response = await sendFeedBack(
        furnitureResult.requestId,
        rating,
        comment
      );

      if (response.message) {
        setIsFeedbackModalOpen(false);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error while sending feedback:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="grid grid-cols-3 items-center">
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
            value={currentTab}
            onValueChange={(value) => {
              if (TABS.includes(value as TabType)) {
                setSearchParams({ tab: value });
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

            {TABS.map((tab) => (
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

                {!showInput[tab] && tab === "myynti" && (
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={handleCreateSalesPost}
                      className="w-32"
                      disabled={isLoading}
                    >
                      Kyllä
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setShowInput((prev) => ({ ...prev, myynti: true }))
                      }
                      className="w-32"
                      disabled={isLoading}
                    >
                      Ei kiitos
                    </Button>
                  </div>
                )}

                {(showInput[tab] || tab !== "myynti") && (
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

          {chatMessages[currentTab].length > 1 && (
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
