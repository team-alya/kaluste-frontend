import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    await onSubmit(rating, comment);
    setRating(1);
    setComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Anna palautetta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Anna arvio (1-5)</p>
            <Slider
              className="mt-2"
              defaultValue={[1]}
              value={[rating]}
              max={5}
              step={1}
              onValueChange={(value) => setRating(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Kommenttisi</p>
            <Textarea
              placeholder="Kirjoita palautteesi tähän..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Peruuta
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Lähetä palaute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
