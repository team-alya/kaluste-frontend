import { useChat } from "ai/react";
import { ArrowBigRight, HomeIcon, Loader2, X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFeedback } from "../../lib/hooks/useFeedback";
import {
  getTabInitialMessage,
  SALES_POST_PROMPT,
} from "../../prompts/chatPrompt";
import { useFurnitureStore } from "../../stores/furnitureStore";
import { TABS, TabType } from "../../types/chat";
import { Message } from "../Message";
import PageWrapper from "../PageWrapper";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FeedbackForm from "./FeedbackForm";

type SalesTabState = "awaiting_confirmation" | "chatting";

const ChatbotPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get("tab") as TabType) || "myynti";
  const [salesTabState, setSalesTabState] = React.useState<SalesTabState>(
    "awaiting_confirmation"
  );
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
      furnitureContext: furnitureResult || {},
    },
    initialMessages: [
      {
        id,
        role: "assistant",
        content: getTabInitialMessage(currentTab, priceAnalysis || undefined),
      },
    ],
  });

  const {
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    isDialogOpen,
    setIsDialogOpen,
    handleFeedbackSubmit,
  } = useFeedback(id, furnitureResult!);

  useEffect(() => {
    if (!furnitureResult) {
      navigate("/");
    }
  }, [furnitureResult, navigate]);

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "myynti" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCreateSalesPost = async () => {
    setSalesTabState("chatting");
    await append({
      role: "user",
      content: SALES_POST_PROMPT,
    });
  };

  const handleDeclineSalesPost = () => {
    setSalesTabState("chatting");
    setMessages((messages) => [
      ...messages,
      {
        id,
        role: "assistant",
        content:
          "Selvä, voit kysyä minulta lisätietoja myynnistä chat-kentän kautta.",
      },
    ]);
  };

  const renderTabContent = (tab: TabType) => {
    const showChatInput = tab !== "myynti" || salesTabState === "chatting";
    const showSalesButtons =
      tab === "myynti" && salesTabState === "awaiting_confirmation";

    const chatContainerHeight =
      tab === "myynti" && salesTabState === "awaiting_confirmation"
        ? "h-[50vh] md:h-[42vh]"
        : "h-[52vh] md:h-[65vh]";

    return (
      <div className="flex flex-col space-y-4">
        <div
          ref={chatContainerRef}
          className={`overflow-y-auto rounded-lg border bg-white md:p-4 transition-all duration-1000 ${chatContainerHeight}`}
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
    <PageWrapper>
      <div className="container mx-auto  max-w-[45rem]">
        <Card className="bg-white/90 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 gap-3">
              <CardTitle className="text-2xl font-bold text-center md:text-left order-1 md:order-2">
                KalusteArvioBotti
              </CardTitle>
              <div className="flex justify-center md:justify-start order-2 md:order-1">
                <Button variant="outline" onClick={() => navigate("/")}>
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Alkuun
                </Button>
              </div>
              <div className="hidden md:block w-[88px] order-3"></div>
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
              <TabsList className="grid w-full grid-cols-4 tracking-tighter md:tracking-normal text-sm md:text-base">
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
                  <DialogDescription>
                    Palautteesi on vastaanotettu onnistuneesti.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default ChatbotPage;
