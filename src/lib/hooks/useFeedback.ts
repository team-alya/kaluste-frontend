import { useEffect, useState } from "react";
import { sendFeedBack } from "../../services/chatService";
import { FurnitureFormData } from "../../types/furniture";

export const useFeedback = (id: string, furnitureResult: FurnitureFormData) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<number | null>(null);

  useEffect(() => {
    if (isDialogOpen && !autoCloseTimer) {
      const timer = window.setTimeout(() => {
        setIsDialogOpen(false);
        setAutoCloseTimer(null);
      }, 2500);
      setAutoCloseTimer(timer);
    }

    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        setAutoCloseTimer(null);
      }
    };
  }, [isDialogOpen, autoCloseTimer]);

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    if (!furnitureResult?.requestId) {
      return {
        success: false,
        error: "Arvioinnin ID puuttuu",
      };
    }

    try {
      const { message } = await sendFeedBack(id, rating, comment);
      if (message) {
        setIsFeedbackModalOpen(false);
        setIsDialogOpen(true);
        return { success: true };
      }
      return {
        success: false,
        error: "Palautteen lähetys epäonnistui",
      };
    } catch (error) {
      console.error("Error while sending feedback:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Palautteen lähetyksessä tapahtui virhe";

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    isDialogOpen,
    setIsDialogOpen,
    handleFeedbackSubmit,
  };
};
