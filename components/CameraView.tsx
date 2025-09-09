import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        setError('Camera not supported by this browser.');
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      let message = 'Could not access the camera. Please check permissions.';
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
            message = "Camera access was denied. Please allow camera access in your browser settings.";
        } else if (err.name === "NotFoundError") {
            message = "No camera was found on this device.";
        }
      }
      setError(message);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && !error) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
            onCapture(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="camera-modal-title">
      <div id="camera-modal-title" className="sr-only">Camera View</div>
      <div className="relative w-full max-w-3xl bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
         <video ref={videoRef} playsInline className="w-full h-auto aspect-video object-cover" style={{transform: 'scaleX(-1)'}} />
        <canvas ref={canvasRef} className="hidden" />
        {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-red-400 p-4 bg-black bg-opacity-70">
                <p className="font-semibold">Camera Error</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        )}
      </div>
      <div className="mt-6 flex w-full max-w-3xl items-center justify-around">
        <button 
            onClick={onClose} 
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg"
            aria-label="Close camera"
        >
          Cancel
        </button>
        <button 
            onClick={handleCapture} 
            disabled={!!error} 
            className="w-16 h-16 rounded-full bg-white p-1 ring-4 ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
            aria-label="Take picture"
        >
            <div className="w-full h-full rounded-full bg-white hover:bg-gray-200 transition-colors"></div>
        </button>
        <div className="w-16"></div>
      </div>
    </div>
  );
};
