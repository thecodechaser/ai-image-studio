import React from 'react';
import { History as HistoryIcon, Clock, Palette, MessageSquare } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryProps {
  items: HistoryItem[];
  onItemSelect: (item: HistoryItem) => void;
  className?: string;
}

export const History: React.FC<HistoryProps> = ({ items, onItemSelect, className = '' }) => {
  if (items.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Generation History</h3>
          <p className="text-gray-500">Your recent generations will appear here</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <HistoryIcon className="w-5 h-5" />
        Recent Generations
      </h3>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemSelect(item)}
            className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
            aria-label={`View generation: ${item.prompt.slice(0, 50)}...`}
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt="Generated result"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-start gap-1">
                    <MessageSquare className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {item.prompt}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Palette className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{item.style}</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};