import React, { useState, useRef } from "react";
import {Camera} from "react-camera-pro";
import '../App.css';

const ImageUploadPage = () => {
    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [takeImage, setTakeImage] = useState(false);

    return (
        <>
            <h1 className='h1'>Lataa kuva</h1>

            <p className="text">Varmista, että kaluste on hyvin valaistu ja koko huonekalu näkyy kuvassa.</p>

            <button className='button' onClick={() => setTakeImage(true)}>OTA KUVA</button>

            {takeImage &&
            <div>
                    <button className='button' onClick={() => setImage(camera.current.takePhoto())}>
                        Ota kuva
                    </button>

                    <button className='button' onClick={() => setTakeImage(false)}>
                        Sulje kamera
                    </button>
            </div>
}

            {takeImage &&
            <div className="camera-container">
                <Camera ref={camera} />
            </div>
            }
                
                {image && (
                    <div>
                        <h2>Kuva otettu:</h2>
                        <img src={image} alt='Taken' />
                        <button onClick={() => setImage(null)}>POISTA KUVA</button>
                    </div>
                )}   
            
            <button className='button'>GALLERIA</button>
        </>
    )
}

export default ImageUploadPage;

