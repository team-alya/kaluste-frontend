import { Message as baseMessage } from "ai";
import { useChat } from "ai/react";
import { ArrowBigRight, HomeIcon, Loader2, X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getInitialMessage } from "../../lib/utils";
import { useFurnitureStore } from "../../stores/furnitureStore";
import { TABS, TabType } from "../../types/chat";
import { Message } from "../Message";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FeedbackForm from "./FeedbackForm";

type SalesTabState = "awaiting_confirmation" | "chatting";

const ChatbotPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get("tab") as TabType) || "myynti";
  const [salesTabState, setSalesTabState] = React.useState<SalesTabState>(
    "awaiting_confirmation",
  );
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { furnitureResult, priceAnalysis } = useFurnitureStore();
  const id = `${furnitureResult?.requestId}-${currentTab}`;
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    setMessages,
    isLoading,
    stop,
  } = useChat({
    api: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/chat`,
    id: id,
    body: {
      requestId: furnitureResult?.requestId,
    },
  });

  useEffect(() => {
    if (!furnitureResult) {
      navigate("/");
    }
  }, [furnitureResult, navigate]);

  useEffect(() => {
    console.log("isLoading", isLoading);
  }, [currentTab, isLoading, stop]);

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "myynti" });
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Only set initial messages if we don't have any for the current tab
    if (messages.length === 0) {
      const initialMessage = getInitialMessage({
        id: id,
        currentTab,
        priceAnalysis: priceAnalysis ?? undefined,
      });
      if (initialMessage) {
        setMessages([initialMessage as unknown as baseMessage]);
      }
    }
  }, [
    currentTab,
    furnitureResult?.requestId,
    id,
    messages.length,
    priceAnalysis,
    setMessages,
  ]);

  const handleCreateSalesPost = async () => {
    setSalesTabState("chatting");
    await append({
      role: "user",
      content: `Luo myynti-ilmoitus kalusteelle, jossa annetaan selkeä ja myyvä kuvaus. 
      Sisällytä ilmoitukseen kalusteen nimi, hinta, väri, koko(pituus, leveys, korkeus) ja kunto. 
      Ilmoituksen tulee olla helposti luettavissa ja houkutteleva potentiaalisille ostajille, 
      mutta älä käytä erikoismerkkejä, kuten tähtiä tai emojeita. 
      Kirjoita ilmoitus asiallisella ja myyntiin sopivalla tyylillä.`,
    });
  };

  const handleDeclineSalesPost = async () => {
    setSalesTabState("chatting");
    await append({
      role: "assistant",
      content:
        "Selvä, voit kysyä minulta lisätietoja myynnistä chat-kentän kautta.",
    });
  };

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    if (!furnitureResult?.requestId) {
      console.error("No requestId available");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: furnitureResult.requestId,
            review: { rating, comment },
          }),
        },
      );

      if (response.ok) {
        setIsFeedbackModalOpen(false);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error while sending feedback:", error);
    }
  };

  const renderTabContent = (tab: TabType) => {
    const showChatInput = tab !== "myynti" || salesTabState === "chatting";
    const showSalesButtons =
      tab === "myynti" && salesTabState === "awaiting_confirmation";

    return (
      <div className="space-y-4">
        <div
          ref={chatContainerRef}
          className="h-[400px] overflow-y-auto rounded-lg border bg-white p-4"
        >
          <div className="flex flex-col space-y-2">
            {messages.map((message, index) => (
              <Message
                key={index}
                role={message.role === "user" ? "user" : "assistant"}
                content={message.content}
              />
            ))}
          </div>
        </div>

        {showSalesButtons && (
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
              onClick={handleDeclineSalesPost}
              className="w-32"
              disabled={isLoading}
            >
              Ei kiitos
            </Button>
          </div>
        )}

        {showChatInput && (
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 bg-white p-2 rounded-lg border shadow-sm relative"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Kirjoita viestisi..."
              disabled={isLoading}
              className="flex-grow pr-12 transition-opacity"
              style={{ opacity: isLoading ? 0.7 : 1 }}
              aria-label="Chat viesti"
            />

            {isLoading ? (
              <Button
                type="button"
                onClick={() => stop()}
                variant="destructive"
                className="shrink-0 transition-all duration-200 ease-in-out hover:bg-red-600"
              >
                <X className="h-4 w-4 mr-2" />
                <span>Stop</span>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="shrink-0 transition-all duration-200 ease-in-out"
                disabled={!input.trim()}
                title="Lähetä viesti (Enter)"
              >
                <span>Lähetä</span>
                <ArrowBigRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </form>
        )}
      </div>
    );
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
                if (isLoading) {
                  stop();
                }
                setSearchParams({ tab: value });
              }
            }}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger disabled={isLoading} value="myynti">
                Myynti
              </TabsTrigger>
              <TabsTrigger disabled={isLoading} value="lahjoitus">
                Lahjoitus
              </TabsTrigger>
              <TabsTrigger disabled={isLoading} value="kierrätys">
                Kierrätys
              </TabsTrigger>
              <TabsTrigger disabled={isLoading} value="kunnostus">
                Kunnostus
              </TabsTrigger>
            </TabsList>

            {TABS.map((tab) => (
              <TabsContent key={tab} value={tab}>
                {renderTabContent(tab)}
              </TabsContent>
            ))}
          </Tabs>

          {messages.length > 1 && (
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
