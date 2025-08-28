import React from 'react';
import { Palette } from 'lucide-react';
import { StyleOption } from '../types';

interface StyleSelectorProps {
  value: StyleOption;
  onChange: (style: StyleOption) => void;
  className?: string;
}

const STYLE_OPTIONS: { value: StyleOption; label: string; description: string }[] = [
  { value: 'Editorial', label: 'Editorial', description: 'Clean, professional magazine style' },
  { value: 'Streetwear', label: 'Streetwear', description: 'Urban, contemporary fashion' },
  { value: 'Vintage', label: 'Vintage', description: 'Classic, retro aesthetic' },
  { value: 'Modern', label: 'Modern', description: 'Sleek, minimalist design' },
  { value: 'Retro', label: 'Retro', description: 'Nostalgic, throwback vibes' },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label htmlFor="style-selector" className="block text-lg font-semibold text-gray-900">
        <Palette className="w-5 h-5 inline mr-2" />
        Style
      </label>
      <select
        id="style-selector"
        value={value}
        onChange={(e) => onChange(e.target.value as StyleOption)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
        aria-describedby="style-help"
      >
        {STYLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div id="style-help" className="text-sm text-gray-600">
        {STYLE_OPTIONS.find(option => option.value === value)?.description}
      </div>
    </div>
  );
};