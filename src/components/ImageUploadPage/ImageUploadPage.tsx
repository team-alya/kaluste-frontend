import {
  AlertCircle,
  CameraIcon,
  ImageIcon,
  ImagePlus,
  Info,
  Upload,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../services/furniture-api";
import { useFurnitureStore } from "../../stores/furnitureStore";
import { BackButton } from "../back-button";
import LoaderAnimation from "../loader";
import PageWrapper from "../PageWrapper";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CameraType {
  takePhoto: () => string;
}

const ImageUploadPage: React.FC = () => {
  const camera = useRef<CameraType | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageState, setImageState] = useState<{
    preview: string | null;
    file: File | null;
  }>({ preview: null, file: null });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setFurnitureResult = useFurnitureStore(
    (state) => state.setFurnitureResult,
  );

  useEffect(() => {
    if (isCameraOpen) {
      navigator.mediaDevices.getUserMedia({ video: true }).catch((error) => {
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
  }, [isCameraOpen]);

  const handleFileInputClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageState({
        preview: URL.createObjectURL(file),
        file,
      });
    }
  };

  const handleCameraCapture = () => {
    try {
      const capturedImage = camera.current?.takePhoto();
      if (capturedImage) {
        fetch(capturedImage)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "captured-image.jpg", {
              type: "image/jpeg",
            });
            setImageState({
              preview: URL.createObjectURL(file),
              file,
            });
            setIsCameraOpen(false);
            setCameraError(null);
          })
          .catch(() => {
            setCameraError("Kuvan ottaminen epäonnistui. Yritä uudelleen.");
          });
      }
    } catch (error) {
      console.error("Camera capture error:", error);
      setCameraError("Kuvan ottaminen epäonnistui");
    }
  };

  const handleImageUpload = async () => {
    if (!imageState.file) return;

    setIsLoading(true);
    try {
      const result = await uploadImage(imageState.file);
      setFurnitureResult(result);
      navigate("/confirmation", {
        state: { furnitureResult: result },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      navigate("/confirmation");
    } finally {
      setIsLoading(false);
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    setCameraError(null);
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center justify-between relative">
              <BackButton />
              <CardTitle className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold flex items-center gap-2">
                <ImagePlus className="h-6 w-6 text-primary" />
                {!imageState.preview ? "Lataa kuva" : "Kalusteen tunnistus"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <LoaderAnimation isLoading={isLoading} text="Analysoi kuvaa..." />

            {!imageState.preview ? (
              <div className="space-y-6">
                <div className="bg-blue-50  border border-blue-100 rounded-lg p-4 flex justify-center mx-auto w-fit gap-3">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    Varmista, että kaluste on hyvin valaistu ja koko huonekalu
                    näkyy kuvassa.
                  </p>
                </div>

                {!isCameraOpen && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-secondary-foreground">
                      <ImageIcon className="h-5 w-5" />
                      <span className="font-medium">Esimerkki kuva</span>
                    </div>
                    <div className="relative group">
                      <img
                        src={"/replica-flux-pro.jpg"}
                        alt="pov-user-taking-picture-of-furniture"
                        className="w-full max-w-md mx-auto rounded-lg shadow-xl border-2"
                      />
                    </div>
                  </div>
                )}

                {!isCameraOpen ? (
                  <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
                    <Button
                      variant={"outline"}
                      onClick={() => setIsCameraOpen(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      <CameraIcon className="h-4 w-4" />
                      Ota kuva
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={handleFileInputClick}
                      className="w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Galleria
                    </Button>
                    <input
                      type="file"
                      id="file-input"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cameraError ? (
                      <div className="space-y-4">
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-700">{cameraError}</p>
                        </div>
                        <div className="flex justify-center px-4 sm:px-0">
                          <Button
                            variant="outline"
                            onClick={closeCamera}
                            className="w-full sm:w-auto flex items-center justify-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Sulje kamera
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
                          <Camera
                            ref={camera}
                            facingMode="environment"
                            aspectRatio={4 / 3}
                            errorMessages={{
                              noCameraAccessible: "Kameraan ei saada yhteyttä",
                              permissionDenied: "Kameran käyttöoikeus evätty",
                              switchCamera: "Kameran vaihtaminen epäonnistui",
                              canvas: "Canvas-elementtiä ei tueta",
                            }}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
                          <Button
                            onClick={handleCameraCapture}
                            className="w-full sm:w-auto flex items-center justify-center gap-2"
                          >
                            <CameraIcon className="h-4 w-4" />
                            Ota kuva
                          </Button>
                          <Button
                            variant="outline"
                            onClick={closeCamera}
                            className="w-full sm:w-auto flex items-center justify-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Sulje kamera
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 ">
                <div className="bg-blue-50 px-4 py-3 rounded-lg border mx-auto border-blue-100 mb-6 flex items-center gap-2 w-fit">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Tarkista, että kaluste näkyy kuvassa selkeästi ennen
                    lähettämistä
                  </p>
                </div>

                <div className="relative group">
                  <img
                    src={imageState.preview}
                    alt="Otettu kuva"
                    className="outline outline-2 outline-zinc-200 w-full max-w-md mx-auto rounded-lg shadow-lg transition-transform duration-200 group-hover:scale-[1.01]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
                  <Button
                    variant={"outline"}
                    onClick={handleImageUpload}
                    className="w-full h-10 sm:w-auto flex items-center justify-center gap-2 "
                    size="lg"
                  >
                    <Upload className="h-4 w-4" />
                    Lähetä kuva analysoitavaksi
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setImageState({ preview: null, file: null })}
                    className="w-full h-10 sm:w-auto flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Ota uusi kuva
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default ImageUploadPage;
