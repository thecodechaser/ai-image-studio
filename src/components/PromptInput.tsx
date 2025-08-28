import React from 'react';
import { MessageSquare } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  placeholder = "Describe what you want to create...",
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor="prompt-input" className="block text-lg font-semibold text-gray-900">
        <MessageSquare className="w-5 h-5 inline mr-2" />
        Prompt
      </label>
      <textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-500"
        aria-describedby="prompt-help"
      />
      <p id="prompt-help" className="text-sm text-gray-600">
        Be specific and descriptive for better results
      </p>
    </div>
  );
};