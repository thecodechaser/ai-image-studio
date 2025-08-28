export interface GenerationRequest {
  imageDataUrl: string;
  prompt: string;
  style: string;
}

export interface GenerationResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
}

export interface GenerationError {
  message: string;
}

export interface HistoryItem extends GenerationResponse {}

export type StyleOption = 'Editorial' | 'Streetwear' | 'Vintage' | 'Modern' | 'Retro';

export interface UploadedImage {
  file: File;
  dataUrl: string;
  preview: string;
}