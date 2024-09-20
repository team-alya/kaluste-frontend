import React, { useState, useRef } from "react";
import {Camera} from "react-camera-pro";
import '../App.css';

const ImageUploadPage = () => {
    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [takeImage, setTakeImage] = useState(false);

    return (
        <div className="container">
            <h1 className='h1'>Lataa kuva</h1>

            <p className="text">Varmista, että kaluste on hyvin valaistu ja koko huonekalu näkyy kuvassa.</p>

            {!takeImage && (
                <>
                    <button className='button' onClick={() => setTakeImage(true)}>
                        OTA KUVA
                    </button>
                    <button className='button'>
                        GALLERIA
                    </button>
                </>
            )}
            {takeImage && (
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
                            aspectRatio={16 / 9}
                        />
                        
                    </div>

            </>
            )}
                
                {image && (
                    <div className="image-container">
                        <h2>Kuva otettu:</h2>
                        <img src={image} style={{width: "auto", height: "auto", objectFit: "contain"}} alt='Taken' />
                        <button onClick={() => setImage(null)}>POISTA KUVA</button>
                    </div>
                )}   
        </div>
    )
}

export default ImageUploadPage;

