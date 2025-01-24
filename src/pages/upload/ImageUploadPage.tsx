import { BackButton } from "@/components/back-button";
import LoaderAnimation from "@/components/loader";
import PageWrapper from "@/components/PageWrapper";
import PhotoGuide from "@/components/PhotoGuide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCamera } from "@/lib/hooks/useCamera";
import { uploadImage } from "@/services/furniture-api";
import { useFurnitureStore } from "@/stores/furnitureStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CameraIcon,
  ImagePlus,
  Info,
  Upload,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";

const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const ImageUploadPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageState, setImageState] = useState<{
    preview: string | null;
    file: File | null;
  }>({ preview: null, file: null });
  const {
    camera,
    isCameraOpen,
    cameraError,
    setIsCameraOpen,
    closeCamera,
    captureImage,
  } = useCamera();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setFurnitureResult = useFurnitureStore(
    (state) => state.setFurnitureResult,
  );

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

  return (
    <PageWrapper>
      <div className="px-4 min-h-screen">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center justify-between relative ">
              <div className="z-10">
                <BackButton />
              </div>
              <CardTitle className="w-full sm:absolute sm:left-1/2 sm:-translate-x-1/2 text-2xl font-bold flex items-center justify-center gap-2 whitespace-nowrap">
                <ImagePlus className="h-6 w-6 text-primary" />
                {!imageState.preview ? "Lataa kuva" : "Kalusteen tunnistus"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <LoaderAnimation isLoading={isLoading} text="Analysoi kuvaa..." />

            <AnimatePresence mode="wait">
              {!imageState.preview ? (
                <motion.div
                  key="upload-view"
                  className="space-y-6"
                  {...fadeAnimation}
                >
                  <PhotoGuide />

                  <AnimatePresence mode="wait">
                    {!isCameraOpen ? (
                      <motion.div
                        key="gallery-view"
                        className="space-y-4"
                        {...fadeAnimation}
                      >
                        <div className="relative group">
                          <img
                            src={"/replica-flux-pro.jpg"}
                            alt="pov-user-taking-picture-of-furniture"
                            className="w-full max-w-md mx-auto rounded-lg shadow-xl border-2"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
                          <Button
                            variant={"outline"}
                            onClick={() => setIsCameraOpen(true)}
                            className="w-full flex items-center justify-center gap-2 sm:w-48 h-10"
                          >
                            <CameraIcon className="h-4 w-4" />
                            Ota kuva
                          </Button>
                          <Button
                            variant={"outline"}
                            onClick={handleFileInputClick}
                            className="w-full flex items-center justify-center gap-2 sm:w-48 h-10"
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
                      </motion.div>
                    ) : (
                      <motion.div
                        key="camera-view"
                        className="space-y-4"
                        {...fadeAnimation}
                      >
                        {cameraError ? (
                          <div className="space-y-4">
                            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-red-700">
                                {cameraError}
                              </p>
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
                                  noCameraAccessible:
                                    "Kameraan ei saada yhteyttä",
                                  permissionDenied:
                                    "Kameran käyttöoikeus evätty",
                                  switchCamera:
                                    "Kameran vaihtaminen epäonnistui",
                                  canvas: "Canvas-elementtiä ei tueta",
                                }}
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
                              <Button
                                onClick={() =>
                                  captureImage((file) => {
                                    setImageState({
                                      preview: URL.createObjectURL(file),
                                      file,
                                    });
                                  })
                                }
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="preview-view"
                  className="space-y-6"
                  {...fadeAnimation}
                >
                  <div className="bg-green-50 px-4 py-3 rounded-lg border mx-auto border-green-100 mb-6 flex items-center gap-2 w-fit">
                    <Info className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-black font-medium">
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
                      className="w-full h-10 sm:w-auto flex items-center justify-center gap-2"
                      size="lg"
                    >
                      <Upload className="h-4 w-4" />
                      Lähetä kuva analysoitavaksi
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setImageState({ preview: null, file: null })
                      }
                      className="w-full h-10 sm:w-auto flex items-center justify-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Ota uusi kuva
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default ImageUploadPage;
