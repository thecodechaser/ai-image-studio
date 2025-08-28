import React from 'react';
import { Eye, MessageSquare, Palette, Image as ImageIcon } from 'lucide-react';
import { StyleOption } from '../types';

interface LiveSummaryProps {
  imageDataUrl?: string;
  prompt: string;
  style: StyleOption;
  className?: string;
}

export const LiveSummary: React.FC<LiveSummaryProps> = ({
  imageDataUrl,
  prompt,
  style,
  className = '',
}) => {
  const hasContent = imageDataUrl || prompt.trim();

  if (!hasContent) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Live Preview</h3>
          <p className="text-gray-500">Upload an image and add a prompt to see your creation summary</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
      </div>
      
      <div className="space-y-4">
        {imageDataUrl && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Source Image</span>
            </div>
            <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={imageDataUrl}
                alt="Source preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
        
        {prompt.trim() && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Prompt</span>
            </div>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md">
              {prompt}
            </p>
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Style</span>
          </div>
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {style}
          </span>
        </div>
      </div>
    </div>
  );
};