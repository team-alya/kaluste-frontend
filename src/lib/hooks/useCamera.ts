import { useRef, useState } from "react";

interface CameraType {
  takePhoto: () => string;
}

interface CameraHookReturn {
  camera: React.RefObject<CameraType>;
  isCameraOpen: boolean;
  cameraError: string | null;
  setIsCameraOpen: (open: boolean) => void;
  closeCamera: () => void;
  captureImage: (onCapture: (file: File) => void) => Promise<void>;
}

export const useCamera = (): CameraHookReturn => {
  const camera = useRef<CameraType | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const closeCamera = () => {
    // Pelkkä state: n asettaminen false riittää.
    // react-camera-pro lopettaa streamin komponentin unmountissa.
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const captureImage = async (
    onCapture: (file: File) => void,
  ): Promise<void> => {
    try {
      if (!camera.current) {
        throw new Error("Kamera ei ole valmis");
      }

      const capturedImage = camera.current.takePhoto();
      if (!capturedImage) {
        throw new Error("Kuvan ottaminen epäonnistui");
      }

      // Muodostetaan base64-stringistä tiedosto
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], "captured-image.jpg", {
        type: "image/jpeg",
      });

      onCapture(file);
      closeCamera();
    } catch (error) {
      console.error("Camera capture error:", error);
      setCameraError("Kuvan ottaminen epäonnistui");
    }
  };

  return {
    camera,
    isCameraOpen,
    cameraError,
    setIsCameraOpen,
    closeCamera,
    captureImage,
  };
};
