import LoaderAnimation from "@/components/loader";
import PageWrapper from "@/components/PageWrapper";
import PhotoGuide from "@/components/PhotoGuide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCamera } from "@/lib/hooks/useCamera";
import { uploadImage } from "@/services/furniture-api";
import { useFurnitureStore } from "@/stores/furnitureStore";
import { type ModelType, type ReasoningEffortType } from "@/types/furniture";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Brain,
  CameraIcon,
  ImagePlus,
  Info,
  Upload,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";

const modelOptionLabels = [
  { value: "all", label: "Kaikki mallit" },
  { value: "gpt4-1", label: "GPT-4.1" },
  { value: "o3", label: "O3 (Reasoning)" },
  { value: "claude", label: "Claude-3-7 Sonnet" },
  { value: "gemini-2-5", label: "Gemini-2.5-Flash" },
];

const reasoningEffortLabels = [
  { value: "low", label: "Matala päättelyteho" },
  { value: "medium", label: "Keskitason päättelyteho" },
  { value: "high", label: "Korkea päättelyteho" },
];

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

  const [selectedModel, setSelectedModel] = useState<ModelType>("o3");
  const [selectedReasoningEffort, setSelectedReasoningEffort] =
    useState<ReasoningEffortType>("high");

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
      // Create model options object
      const modelOptions = {
        model: selectedModel || "all",
        ...(selectedModel === "o3" && selectedReasoningEffort
          ? { reasoningEffort: selectedReasoningEffort }
          : {}),
      };

      const result = await uploadImage(imageState.file, modelOptions);
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
                <button
                  onClick={() => navigate("/")}
                  className="p-2 text-green-light hover:text-green-dark transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={24} />
                </button>
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

                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
                      <h3 className="font-medium text-green-800 flex items-center gap-2 mb-2">
                        <Brain className="h-5 w-5" />
                        Valitse tekoälymalli
                      </h3>
                      <p className="text-sm text-secondary-foreground mb-2">
                        Voit valita tekoälymallin, jota käytetään kalusteen
                        ensimmäiseen tunnistukseen. Mikäli valittu malli ei
                        tunnista huonekalua, annamme parhaan arvauksen GPT-4.1
                        mallin avulla. Oletuksena käytetään O3-mallia korkealla
                        päättelyteholla.
                      </p>
                      <Separator className="my-4" />
                      <ul className="text-xs text-secondary-foreground space-y-1 ml-4 list-disc">
                        <li>
                          <strong>Kaikki mallit</strong>
                        </li>
                        <li>
                          <strong>GPT-4.1</strong>
                        </li>
                        <li>
                          <strong>O3 (Reasoning)</strong> - Tukee päättelytehon
                          säätämistä, tarkempi kalustemallien tunnistaja.
                          Korkeampi päättelyteho parantaa tuloksia mutta
                          pidentää käsittelyaikaa
                        </li>
                        <li>
                          <strong>Claude-3-7 Sonnet</strong>
                        </li>
                        <li>
                          <strong>Gemini-2.5-Flash</strong>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 px-4 sm:px-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Select
                              onValueChange={(value) =>
                                setSelectedModel(value as ModelType)
                              }
                              defaultValue="o3"
                            >
                              <SelectTrigger className="w-full sm:w-auto">
                                <SelectValue placeholder="Valitse tekoälymalli" />
                              </SelectTrigger>
                              <SelectContent>
                                {modelOptionLabels.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Valitse tekoälymalli, jota käytetään kalusteen
                              analysointiin.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {selectedModel === "o3" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Select
                                onValueChange={(value) =>
                                  setSelectedReasoningEffort(
                                    value as ReasoningEffortType,
                                  )
                                }
                                defaultValue="high"
                              >
                                <SelectTrigger className="w-full sm:w-auto">
                                  <SelectValue placeholder="Valitse päättelyteho" />
                                </SelectTrigger>
                                <SelectContent>
                                  {reasoningEffortLabels.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Valitse päättelyteho, joka vaikuttaa analyysin
                                tarkkuuteen.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
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
