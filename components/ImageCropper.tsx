import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (file: File) => void;
  onClose: () => void;
}

// Function to generate a centered crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// Helper function to draw the cropped image on a canvas
async function getCroppedImg(image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<File> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('No 2d context');
    }

    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;
    
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const croppedFile = new File([blob], fileName, { type: 'image/jpeg', lastModified: Date.now() });
                resolve(croppedFile);
            },
            'image/jpeg',
            0.95 // High quality
        );
    });
}


export const ImageCropper: React.FC<ImageCropperProps> = ({ imageFile, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageUrl] = useState(() => URL.createObjectURL(imageFile));

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1 / 1));
  }
  
  const handleConfirmCrop = async () => {
    const image = imgRef.current;
    if (image && completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
      try {
        const croppedFile = await getCroppedImg(image, completedCrop, imageFile.name);
        onCropComplete(croppedFile);
      } catch (e) {
        console.error('Cropping failed', e);
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-start sm:items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="w-full max-w-xl bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-4 my-auto">
        <h2 className="text-xl font-bold text-center text-gray-200 mb-4">Crop Your Photo</h2>
        <p className="text-sm text-center text-gray-400 mb-4">Adjust the selection to frame your face and shoulders.</p>
        <div className="bg-black flex justify-center">
            <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                minWidth={50}
            >
                <img
                    ref={imgRef}
                    alt="Image to be cropped"
                    src={imageUrl}
                    onLoad={onImageLoad}
                    className="block max-w-full"
                    style={{ maxHeight: '60vh' }}
                />
            </ReactCrop>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button 
              onClick={onClose} 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
              onClick={handleConfirmCrop} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};