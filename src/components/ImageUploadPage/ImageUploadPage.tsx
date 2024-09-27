import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import './ImageUploadPage.css';

const ImageUploadPage = () => {
    const camera = useRef(null);
    const fileInputRef = useRef(null); // Create a ref for the file input
    const [image, setImage] = useState(null);
    const [takeImage, setTakeImage] = useState(false);

    function handleFileInputClick() {
        fileInputRef.current.click(); // Programmatically click the file input
    }

    function handleChange(e) {
        console.log(e.target.files);
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <div className="container">
            {!image ? (
                <>
                    <h1 className='h1'>Lataa kuva</h1>

                    <p className="text">Varmista, että kaluste on hyvin valaistu ja koko huonekalu näkyy kuvassa.</p>

                    {!takeImage ? (
                        <div className="button-container">
                            <button className='button' onClick={() => setTakeImage(true)}>
                                OTA KUVA
                            </button>

                            <button className="button" onClick={handleFileInputClick}>
                                GALLERIA
                            </button>

                            {/* Hidden file input */}
                            <input
                                type="file"
                                id="file-input"
                                className="file-input"
                                ref={fileInputRef}
                                onChange={handleChange}
                                style={{ display: 'none' }} // Hide the input element
                            />
                        </div>
                    ) : (
                        <>
                            <button className='button' onClick={() => {
                                setImage(camera.current.takePhoto());
                                setTakeImage(false);
                            }}>
                                Ota kuva
                            </button>
                            <button className='button' onClick={() => setTakeImage(false)}>
                                Sulje kamera
                            </button>

                            <div className="camera-container">
                                <Camera
                                    ref={camera}
                                    facingMode="environment"
                                    aspectRatio={4 / 3}
                                    errorMessages={{
                                        noCameraAccessible: undefined,
                                        permissionDenied: undefined,
                                        switchCamera: undefined,
                                        canvas: undefined
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
                    <img src={image} alt='Taken' />
                    <div className="button-container">
                        <button className="button">KYLLÄ</button>
                        <button className="button" onClick={() => setImage(null)}>EI</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageUploadPage;
