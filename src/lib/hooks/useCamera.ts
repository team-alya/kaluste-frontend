import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    let stream: MediaStream | null = null;
    let retryTimeout: NodeJS.Timeout;

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // takakamera
          },
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        setCameraError(null);
      } catch (error) {
        if (!(error instanceof DOMException)) {
          console.error("Unknown camera error:", error);
          setCameraError("Tuntematon virhe kameran käytössä");
          return;
        }

        console.error("Camera access error:", error);

        if (error.name === "NotFoundError") {
          setCameraError("Kameraa ei löytynyt laitteestasi");
        } else if (error.name === "NotAllowedError") {
          setCameraError("Kameran käyttöoikeus evätty");
        } else {
          setCameraError("Kameraan ei saada yhteyttä");

          // Jos kyseessä on muu virhe, yritetään uudelleen pienellä viiveellä
          retryTimeout = setTimeout(() => {
            if (isCameraOpen) {
              initCamera();
            }
          }, 1000);
        }
      }
    };

    if (isCameraOpen) {
      initCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [isCameraOpen]);

  const closeCamera = () => {
    const videoElement = document.querySelector("video");
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    setIsCameraOpen(false);
    setCameraError(null);
  };

  const captureImage = async (
    onCapture: (file: File) => void
  ): Promise<void> => {
    try {
      if (!camera.current) {
        throw new Error("Kamera ei ole valmis");
      }

      const capturedImage = camera.current.takePhoto();
      if (!capturedImage) {
        throw new Error("Kuvan ottaminen epäonnistui");
      }

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
