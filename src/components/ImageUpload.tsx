import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadProps {
  onImageUpload: (dataUrl: string) => void;
  imageDataUrl?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, imageDataUrl, className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadedImage, isProcessing, error, handleFileUpload, clearImage, setImage } = useImageUpload();

  React.useEffect(() => {
    if (!imageDataUrl) {
      clearImage();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (imageDataUrl && !uploadedImage) {
      const mockFile = new File([''], 'selected-image.jpg', { type: 'image/jpeg' });
      const mockUploadedImage = {
        file: mockFile,
        dataUrl: imageDataUrl,
        preview: imageDataUrl,
      };
      setImage(mockUploadedImage);
    }
  }, [imageDataUrl, uploadedImage, clearImage, setImage]);

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
    onImageUpload('');
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
            className="p-1 text-red-600 transition-colors rounded-md hover:text-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Clear uploaded image"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 border border-red-200 rounded-md bg-red-50">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {!uploadedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
          className="p-8 text-center transition-all duration-200 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
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
              <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin" />
              <span className="text-blue-600">Processing image...</span>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-gray-600">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500">PNG or JPG (max 10MB)</p>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="h-64 overflow-hidden bg-gray-100 rounded-lg">
            <img
              src={uploadedImage.preview}
              alt="Uploaded preview"
              className="object-contain w-full h-full"
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