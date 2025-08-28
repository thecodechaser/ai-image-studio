export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DIMENSION = 1920;

export const isValidImageType = (file: File): boolean => {
  return file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg';
};

export const isFileSizeValid = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const resizeImage = (file: File, maxDimension: number = MAX_DIMENSION): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      const { width, height } = img;
      
      // Calculate new dimensions
      let newWidth = width;
      let newHeight = height;
      
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        newWidth = Math.round(width * ratio);
        newHeight = Math.round(height * ratio);
      }
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and resize image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to data URL with reduced quality if needed
      const quality = newWidth * newHeight > 1000000 ? 0.8 : 0.95;
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      resolve(dataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};