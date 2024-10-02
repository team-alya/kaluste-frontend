import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import "./ImageUploadPage.css";
import stockchair from "./stockchair.jpg";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ImageUploadPage = () => {
  const camera = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [takeImage, setTakeImage] = useState(false);

  function handleFileInputClick() {
    fileInputRef.current.click();
  }

  function handleChange(e) {
    console.log(e.target.files);
    setImage(URL.createObjectURL(e.target.files[0]));
  }

  const navigate = useNavigate();

  const handleYesClick = () => {
    navigate("/confirmation");
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
                  setImage(camera.current.takePhoto());
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

          <img src={image} alt="Taken" />

          <div className="button-container">
            <Button
              className="button"
              variant="contained"
              color="primary"
              onClick={handleYesClick}
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
