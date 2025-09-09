import React from 'react';
import { ATTIRES, BACKGROUNDS } from '../constants';

interface GeneratorControlsProps {
  attire: string;
  setAttire: (attire: string) => void;
  background: string;
  setBackground: (background: string) => void;
  isEnhanced: boolean;
  setIsEnhanced: (isEnhanced: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  hasUploadedImage: boolean;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  attire,
  setAttire,
  background,
  setBackground,
  isEnhanced,
  setIsEnhanced,
  onGenerate,
  isLoading,
  hasUploadedImage
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg space-y-6">
       <h2 className="text-xl font-bold text-gray-300">
        2. Customize Your Headshot
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="attire" className="block text-sm font-medium text-gray-300">
            Corporate Attire
          </label>
          <select
            id="attire"
            value={attire}
            onChange={(e) => setAttire(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {ATTIRES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="background" className="block text-sm font-medium text-gray-300">
            Professional Background
          </label>
          <select
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {BACKGROUNDS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="pt-2">
          <label htmlFor="enhancement" className="flex items-center cursor-pointer">
            <div className="relative">
               <input
                id="enhancement"
                type="checkbox"
                className="sr-only" // hide default checkbox
                checked={isEnhanced}
                onChange={(e) => setIsEnhanced(e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full ${isEnhanced ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isEnhanced ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm text-gray-300">
              AI Enhancement <span className="text-gray-400 text-xs">(Improve pose & lighting)</span>
            </div>
          </label>
        </div>
      </div>
       <button
          onClick={onGenerate}
          disabled={isLoading || !hasUploadedImage}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {isLoading ? 'Generating...' : 'Generate Headshot'}
        </button>
        {!hasUploadedImage && <p className="text-xs text-center text-gray-400">Please upload a photo to enable generation.</p>}
    </div>
  );
};