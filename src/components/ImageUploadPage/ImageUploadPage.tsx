import { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import "./ImageUploadPage.css";
import stockchair from "./stockchair.jpg";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ImageUploadPage = () => {
  const camera = useRef<typeof Camera | null>(null);
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

  const navigate = useNavigate();

  // Convert Base64 to Blob for camera images
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
      lastModified: Date.now(), // You can adjust the lastModified if needed
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
    console.log("Camera image upload triggered");
  
    if (!imageBlob) {
      console.log("No image Blob found for upload");
      return;
    }
  
    try {
      const formData = new FormData();
      console.log(imageBlob);
  
      // If imageBlob is a Blob, convert it to a File before uploading
      const fileToUpload = imageBlob instanceof Blob ? imageBlob : imageBlob;  // Just use imageBlob directly

      formData.append("image", fileToUpload);
  
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
      const response = await fetch(`${apiUrl}/api/image`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        console.error("Failed to upload camera image. Status:", response.status);
      } else {
        const result = await response.json();
        console.log("Camera image uploaded successfully!", result);
        setFurnitureResult(result.result);
        navigate("/confirmation", {
          state: { furnitureResult: result.result, imageBlob },
        });
      }
    } catch (error) {
      console.error("Error uploading camera image:", error);
      navigate("/confirmation", { state: { furnitureResult } });
    }
  };
  

  return (
    <div className="container">
      {!image ? (
        <>
          <h1 className="h1">Lataa kuva</h1>
          <p className="text">
            Varmista, että kaluste on hyvin valaistu ja koko huonekalu näkyy
            kuvassa.
          </p>

          {!takeImage && (
            <img
              src={stockchair}
              className="stock-image"
              alt="stock-photo-chair"
            />
          )}

          {!takeImage ? (
            <div className="button-container">
              <Button
                className="button"
                variant="contained"
                color="primary"
                onClick={() => setTakeImage(true)}
              >
                OTA KUVA
              </Button>

              <Button
                className="button"
                variant="contained"
                color="primary"
                onClick={handleFileInputClick}
              >
                GALLERIA
              </Button>

              <input
                type="file"
                id="file-input"
                className="file-input"
                ref={fileInputRef}
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <>
              <Button
                className="button"
                variant="contained"
                color="primary"
                onClick={() => {
                  const capturedImage = camera.current?.takePhoto();
                  console.log("Captured Image (Base64):", capturedImage); // Log Base64

                  if (capturedImage) {
                    const blob = base64ToFile(capturedImage, "captured-image.jpg");  // Pass both base64 string and filename
                    setImageBlob(blob);  // Store the File for upload
                    setImage(capturedImage);  // Set Base64 image for display
                    setTakeImage(false);
                  }
                }}
              >
                Ota kuva
              </Button>

              <Button
                className="button"
                variant="contained"
                color="primary"
                onClick={() => setTakeImage(false)}
              >
                Sulje kamera
              </Button>

              <div className="camera-container">
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
              </div>
            </>
          )}
        </>
      ) : (
        <div className="image-container">
          <h1 className="h1">Kalusteen tunnistus</h1>

          <p className="text">Onko kuvassa kalusteesi?</p>

          <img src={image} alt="Taken Image" />

          <div className="button-container">
            <Button
              className="button"
              variant="contained"
              color="primary"
              onClick={handleImageUpload}
            >
              KYLLÄ
            </Button>
            <Button
              className="button"
              variant="contained"
              color="primary"
              onClick={() => setImage(null)}
            >
              EI
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPage;
