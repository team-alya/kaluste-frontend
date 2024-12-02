import { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import stockchair from "./stockchair.jpg";
import { useNavigate } from "react-router-dom";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

interface CameraType {
  takePhoto: () => string;
}

const ImageUploadPage = () => {
  const camera = useRef<CameraType | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<File | null>(null); // Store the Blob or File for upload
  const [takeImage, setTakeImage] = useState(false); // For opening the camera
  const [furnitureResult, setFurnitureResult] = useState({
    requestId: "",
    merkki: "",
    väri: "",
    kunto: "",
    mitat: {
      pituus: 0,
      korkeus: 0,
      leveys: 0,
    },
    malli: "",
    materiaalit: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Convert Base64 to Blob since backend is expecting an image
  const base64ToFile = (base64: string, filename: string): File => {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const byteArray = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: mimeString });

    // Create a File from the Blob
    return new File([blob], filename, {
      type: mimeString,
      lastModified: Date.now(),
    });
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0]; // Get the first file
      setImage(URL.createObjectURL(file)); // For displaying the image
      setImageBlob(file); // Store the File object for upload
    }
  };

  // Handle upload for images
  const handleImageUpload = async () => {
    setIsLoading(true);

    console.log("Camera image upload triggered");

    if (!imageBlob) {
      console.log("No image Blob found for upload");
      return;
    }

    try {
      const formData = new FormData();
      console.log(imageBlob);

      // If imageBlob is a Blob, convert it to a File before uploading
      const fileToUpload = imageBlob instanceof Blob ? imageBlob : imageBlob; // Just use imageBlob directly

      formData.append("image", fileToUpload);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${apiUrl}/api/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error(
          "Failed to upload camera image. Status:",
          response.status
        );
      } else {
        const result = await response.json();
        console.log("Camera image uploaded successfully!", result);
        setFurnitureResult(result.result);
        // Navigate to confirmation page and forward the AI result
        navigate("/confirmation", {
          state: { furnitureResult: result.result, imageBlob },
        });
      }
    } catch (error) {
      console.error("Error uploading camera image:", error);
      // Navigate to confirmation page without the AI result
      navigate("/confirmation", { state: { furnitureResult } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{ padding: 3, textAlign: "center", maxWidth: 1200, margin: "0 auto" }}
    >
      {isLoading && (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress />
        </Backdrop>
      )}
      {!image ? (
        <>
          <Typography variant="h4">Lataa kuva</Typography>
          <br />
          <br />
          <Typography variant="h6">
            Varmista, että kaluste on hyvin valaistu ja koko huonekalu näkyy
            kuvassa.
          </Typography>

          {!takeImage && (
            <Box
              component="img"
              src={stockchair}
              alt="stock-photo-chair"
              sx={{
                width: "100%",
                maxWidth: 400,
                borderRadius: 2,
                margin: "1rem auto",
                display: "block",
              }}
            />
          )}

          {!takeImage ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                marginTop: 3,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setTakeImage(true)}
              >
                OTA KUVA
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleFileInputClick}
              >
                GALLERIA
              </Button>

              <input
                type="file"
                id="file-input"
                ref={fileInputRef}
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </Box>
          ) : (
            <>
              <Box sx={{ margin: "1rem auto", maxWidth: 500 }}>
                <Camera
                  ref={camera}
                  facingMode="environment"
                  aspectRatio={4 / 3}
                  errorMessages={{
                    noCameraAccessible: undefined,
                    permissionDenied: undefined,
                    switchCamera: undefined,
                    canvas: undefined,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const capturedImage = camera.current?.takePhoto();
                    if (capturedImage) {
                      const blob = base64ToFile(
                        capturedImage,
                        "captured-image.jpg"
                      );
                      setImageBlob(blob);
                      setImage(capturedImage);
                      setTakeImage(false);
                    }
                  }}
                >
                  Ota kuva
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setTakeImage(false)}
                >
                  Sulje kamera
                </Button>
              </Box>
            </>
          )}
        </>
      ) : (
        <Box>
          <Typography variant="h4">Kalusteen tunnistus</Typography>
          <br />
          <br />
          <Typography variant="h6">Onko kuvassa kalusteesi?</Typography>

          <Box
            component="img"
            src={image}
            alt="Taken Image"
            sx={{
              width: "100%",
              maxWidth: 500,
              borderRadius: 2,
              margin: "1rem auto",
              display: "block",
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleImageUpload}
            >
              KYLLÄ
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setImage(null)}
            >
              EI
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUploadPage;
