import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadProps {
  onImageUpload: (dataUrl: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadedImage, isProcessing, error, handleFileUpload, clearImage } = useImageUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await handleFileUpload(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    await handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    clearImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  React.useEffect(() => {
    if (uploadedImage?.dataUrl) {
      onImageUpload(uploadedImage.dataUrl);
    }
  }, [uploadedImage?.dataUrl, onImageUpload]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
        {uploadedImage && (
          <button
            onClick={handleClear}
            className="text-red-600 hover:text-red-700 p-1 rounded-md transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Clear uploaded image"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {!uploadedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openFileDialog();
            }
          }}
          aria-label="Upload image area"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-blue-600">Processing image...</span>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500">PNG or JPG (max 10MB)</p>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="bg-gray-100 rounded-lg overflow-hidden h-64">
            <img
              src={uploadedImage.preview}
              alt="Uploaded preview"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">{uploadedImage.file.name}</p>
            <p>{(uploadedImage.file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload image file"
      />
    </div>
  );
};