import { useState, useRef } from "react";

export const useCamera = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            setIsActive(true);
        } catch (err) {
            setError("Failed to access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsActive(false);
    };

    const capturePhoto = (): Promise<File | null> => {
        return new Promise((resolve) => {
            if (stream && canvasRef.current) {
                const video = document.querySelector('video');
                if (video) {
                    const canvas = canvasRef.current;
                    const context = canvas.getContext('2d');
                    
                    if (context) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        context.drawImage(video, 0, 0);
                        
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const capturedFile = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
                                resolve(capturedFile);
                            } else {
                                resolve(null);
                            }
                        }, 'image/jpeg', 0.8);
                        return;
                    }
                }
            }
            resolve(null);
        });
    };

    const cleanup = () => {
        stopCamera();
        setError(null);
    };

    return {
        stream,
        isActive,
        error,
        canvasRef,
        startCamera,
        stopCamera,
        capturePhoto,
        cleanup
    };
};
