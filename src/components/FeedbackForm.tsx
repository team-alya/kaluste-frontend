import { Alert } from "@mui/material";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    rating: number,
    comment: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    rating: number,
    comment: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setError(null);
      setIsSubmitting(true);
      const result = await onSubmit(rating, comment);

      if (!result.success) {
        setError(result.error || "Palautteen lähetyksessä tapahtui virhe");
        return;
      }

      setRating(1);
      setComment("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(
        "Palautteen lähetyksessä tapahtui odottamaton virhe. Ole hyvä ja yritä uudelleen.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  const labels = {
    1: "Heikko",
    2: "Välttävä",
    3: "Hyvä",
    4: "Kiitettävä",
    5: "Erinomainen",
  };

  const ticks = [1, 2, 3, 4, 5];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Anna palautetta</DialogTitle>
          <DialogDescription>
            Kerro meille kokemuksestasi ja auta meitä parantamaan palveluamme.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <Alert variant="filled" severity="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <p className="text-sm font-medium">Anna arvio (1-5)</p>
            <div className="px-2">
              <Slider
                min={1}
                max={5}
                step={1}
                value={[rating]}
                onValueChange={(value) => setRating(value[0])}
                disabled={isSubmitting}
              />
              <div className="relative mt-4 mx-1">
                <div className="flex w-full items-center justify-between px-[2px]">
                  {ticks.map((value) => (
                    <div
                      key={value}
                      className="flex w-0 flex-col items-center justify-center"
                    >
                      <span className="text-sm">{value}</span>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {labels[value as keyof typeof labels]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-6">
            <p className="text-sm font-medium">Kommenttisi</p>
            <Textarea
              placeholder="Kirjoita palautteesi tähän..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button
            onClick={handleClose}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Peruuta
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Lähetetään...
              </>
            ) : (
              "Lähetä palaute"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
