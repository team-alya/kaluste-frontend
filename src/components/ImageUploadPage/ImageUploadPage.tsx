import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import './ImageUploadPage.css';
import stockchair from './stockchair.jpg';

const ImageUploadPage = () => {
    const camera = useRef(null);
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null); // For displaying the image
    const [imageBlob, setImageBlob] = useState(null);  // Store the Blob or File for upload
    const [takeImage, setTakeImage] = useState(false); //For opening the camera
    const [furnitureResult, setFurnitureResult] = useState({
        age: 0,
        brand: "",
        color: "",
        condition: "",
        dimensions: {
            height: 0,
            length: 0,
            width: 0
        },
        model: "",
        type: ""
    })

    // Convert Base64 to Blob for camera images
    // Since the react-camera-pro transforms images automatically to base64
    // And the backend expects an image
    const base64ToBlob = (base64) => {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const byteArray = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++) {
            byteArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([byteArray], { type: mimeString });
    };

    function handleFileInputClick() {
        fileInputRef.current.click();
    }

    // Handle file input change
    function handleChange(e) {
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));  // For displaying the image
        setImageBlob(file);  // Store the File object for upload
    }

    // Handle upload for images
    const handleImageUpload = async () => {
        console.log('Camera image upload triggered');
        if (!imageBlob) {
            console.log('No image Blob found for upload');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', imageBlob);

            const response = await fetch('http://localhost:3000/api/image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.error('Failed to upload camera image. Status:', response.status);
            } else {
                const result = await response.json();
                console.log('Camera image uploaded successfully!', result);
                setFurnitureResult(result.result)
            }
        } catch (error) {
            console.error('Error uploading camera image:', error);
        }
    };

    useEffect(() => {
        console.log('Updated furniture result:', furnitureResult);
        console.log('Furniture color:', furnitureResult.color);
    }, [furnitureResult]);


    return (
        <div className="container">
            {!image ? (
                <>
                    <h1 className='h1'>Lataa kuva</h1>

                    <p className="text">Varmista, että kaluste on hyvin valaistu ja koko huonekalu näkyy kuvassa.</p>

                    {!takeImage && (
                        <img src={stockchair} className="stock-image" alt="stock-photo-chair" />
                    )}

                    {!takeImage ? (
                        <div className="button-container">
                            <button className='button' onClick={() => setTakeImage(true)}>
                                OTA KUVA
                            </button>

                            <button className="button" onClick={handleFileInputClick}>
                                GALLERIA
                            </button>

                            <input
                                type="file"
                                id="file-input"
                                className="file-input"
                                ref={fileInputRef}
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    ) : (
                        <>
                            <button className='button' onClick={() => {
                                const capturedImage = camera.current.takePhoto();
                                console.log('Captured Image (Base64):', capturedImage);  // Log Base64

                                const blob = base64ToBlob(capturedImage);  // Convert Base64 to Blob
                                setImageBlob(blob);  // Store Blob for upload
                                setImage(capturedImage);  // Set Base64 image for display
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

                    <img src={image} alt='Taken Image' />

                    <div className="button-container">
                        <button className="button" onClick={handleImageUpload}>
                            KYLLÄ
                        </button>
                        <button className="button" onClick={() => setImage(null)}>EI</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploadPage;
