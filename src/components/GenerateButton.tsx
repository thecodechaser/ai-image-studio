import React from 'react';
import { Zap, StopCircle } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  onAbort?: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  attempt?: number;
  maxAttempts?: number;
  className?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  onAbort,
  isLoading,
  isDisabled,
  attempt,
  maxAttempts,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        <div className="bg-blue-600 text-white px-8 py-4 rounded-lg flex items-center space-x-3 cursor-not-allowed opacity-90">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold">
            {attempt && maxAttempts && attempt > 1 
              ? `Retrying... (${attempt}/${maxAttempts})`
              : 'Generating...'
            }
          </span>
        </div>
        {onAbort && (
          <button
            onClick={onAbort}
            className="text-red-600 hover:text-red-700 flex items-center space-x-2 px-4 py-2 rounded-md transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Abort generation"
          >
            <StopCircle className="w-4 h-4" />
            <span className="text-sm">Cancel</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      aria-describedby="generate-help"
    >
      <Zap className="w-5 h-5" />
      <span>Generate</span>
    </button>
  );
};