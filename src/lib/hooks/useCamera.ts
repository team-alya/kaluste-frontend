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
    console.log("first mount camera");

    if (isCameraOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((videoStream) => {
          stream = videoStream;
        })
        .catch((error) => {
          console.error("Camera access error:", error);
          if (error.name === "NotFoundError") {
            setCameraError("Kameraa ei löytynyt laitteestasi");
          } else if (error.name === "NotAllowedError") {
            setCameraError("Kameran käyttöoikeus evätty");
          } else {
            setCameraError("Kameraan ei saada yhteyttä");
          }
        });
    }

    return () => {
      if (stream) {
        console.log("Cleanup camera stream");

        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOpen]);

  const closeCamera = () => {
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const captureImage = async (
    onCapture: (file: File) => void,
  ): Promise<void> => {
    try {
      const capturedImage = camera.current?.takePhoto();
      if (!capturedImage) return;

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
