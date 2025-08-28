import { useState, useCallback } from 'react';
import { UploadedImage } from '../types';
import { isValidImageType, isFileSizeValid, resizeImage, createImagePreview } from '../utils/imageUtils';

export const useImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      // Validate file type
      if (!isValidImageType(file)) {
        throw new Error('Please upload a PNG or JPG image file.');
      }

      // Validate file size
      if (!isFileSizeValid(file)) {
        throw new Error('File size must be 10MB or less.');
      }

      // Create preview and resized version
      const [preview, dataUrl] = await Promise.all([
        createImagePreview(file),
        resizeImage(file)
      ]);

      setUploadedImage({
        file,
        dataUrl,
        preview,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setUploadedImage(null);
    setError(null);
  }, []);

  return {
    uploadedImage,
    isProcessing,
    error,
    handleFileUpload,
    clearImage,
  };
};