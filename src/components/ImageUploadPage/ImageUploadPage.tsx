import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import "./ImageUploadPage.css";
import stockchair from "./stockchair.jpg";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ImageUploadPage = () => {
  const camera = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null); // For displaying the image
  const [imageBlob, setImageBlob] = useState(null); // Store the Blob or File for upload
  const [takeImage, setTakeImage] = useState(false); // For opening the camera
  const [furnitureResult, setFurnitureResult] = useState({
    merkki: "",
    väri: "",
    kunto: "",
    mitat: {
      pituus: 0,
      korkeus: 0,
      leveys: 0,
    },
    malli: "",
    materiaalit: []
  });

  const navigate = useNavigate();

  // Convert Base64 to Blob for camera images
  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const byteArray = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    console.log("Blob for upload:", imageBlob);
    return new Blob([byteArray], { type: mimeString });
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  // Handle file input change
  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file)); // For displaying the image
    setImageBlob(file); // Store the File object for upload
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
      formData.append("image", imageBlob);

      const response = await fetch("https://3778-2001-14ba-a0d3-e000-ccb3-1707-a92b-8f15.ngrok-free.app/api/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to upload camera image. Status:", response.status);
      } else {
        const result = await response.json();
        console.log("Camera image uploaded successfully!", result);
        setFurnitureResult(result.result.gemini);
        navigate("/confirmation", { state: { furnitureResult: result.result.gemini } });
      }
    } catch (error) {
      console.error("Error uploading camera image:", error);
      navigate("/confirmation", { state: { furnitureResult } });
    }
  };

  useEffect(() => {
    console.log("Updated furniture result:", furnitureResult);
    console.log("Furniture color:", furnitureResult.väri);
  }, [furnitureResult]);

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
                  const capturedImage = camera.current.takePhoto();
                  console.log("Captured Image (Base64):", capturedImage); // Log Base64

                  const blob = base64ToBlob(capturedImage); // Convert Base64 to Blob
                  setImageBlob(blob); // Store Blob for upload
                  setImage(capturedImage); // Set Base64 image for display
                  setTakeImage(false);
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
