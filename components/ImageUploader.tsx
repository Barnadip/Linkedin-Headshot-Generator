import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  imageUrl: string | null;
  onOpenCameraClick: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, imageUrl, onOpenCameraClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelected(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
       <h2 className="text-xl font-bold text-gray-300 mb-4">
        1. Provide a Photo
      </h2>
      <div className="aspect-square w-full rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="User headshot" className="object-cover w-full h-full" />
        ) : (
          <div className="text-center text-gray-500">
            <UploadIcon className="mx-auto h-12 w-12" />
            <p className="mt-2">Upload or use camera for a clear photo</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <button 
          onClick={handleUploadClick} 
          className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          <UploadIcon /> {imageUrl ? 'Change Photo' : 'Upload Photo'}
        </button>
        <button
          onClick={onOpenCameraClick}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          <CameraIcon /> Use Camera
        </button>
      </div>
    </div>
  );
};
