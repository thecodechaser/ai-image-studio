import React, { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ImageUpload } from './components/ImageUpload';
import { PromptInput } from './components/PromptInput';
import { StyleSelector } from './components/StyleSelector';
import { LiveSummary } from './components/LiveSummary';
import { GenerateButton } from './components/GenerateButton';
import { History } from './components/History';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createAbortableMockApiCall } from './utils/mockApi';
import { StyleOption, HistoryItem, GenerationRequest } from './types';

const MAX_HISTORY_ITEMS = 5;
const MAX_RETRY_ATTEMPTS = 3;

function App() {
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<StyleOption>('Editorial');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [currentRequest, setCurrentRequest] = useState<ReturnType<typeof createAbortableMockApiCall> | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('ai-studio-history', []);

  const canGenerate = imageDataUrl && prompt.trim();

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      const newHistory = [item, ...prev.filter(h => h.id !== item.id)];
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, [setHistory]);

  const handleGenerate = useCallback(async (attempt: number = 1) => {
    if (!canGenerate || isGenerating) return;

    setIsGenerating(true);
    setCurrentAttempt(attempt);

    const request: GenerationRequest = {
      imageDataUrl,
      prompt: prompt.trim(),
      style,
    };

    const abortableRequest = createAbortableMockApiCall(request);
    setCurrentRequest(abortableRequest);

    try {
      const response = await abortableRequest.promise;
      addToHistory(response);
      setCurrentRequest(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Generation failed';
      
      if (errorMessage === 'Request aborted') {
        console.log('Generation was aborted by user');
      } else if (errorMessage === 'Model overloaded' && attempt < MAX_RETRY_ATTEMPTS) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        setTimeout(() => {
          handleGenerate(attempt + 1);
        }, delay);
        return; // Don't reset loading state
      } else {
        console.error('Generation error:', errorMessage);
        // Could show error toast here
      }
    } finally {
      setIsGenerating(false);
      setCurrentAttempt(1);
      setCurrentRequest(null);
    }
  }, [canGenerate, isGenerating, imageDataUrl, prompt, style, addToHistory]);

  const handleAbort = useCallback(() => {
    if (currentRequest) {
      currentRequest.abort();
      setCurrentRequest(null);
      setIsGenerating(false);
      setCurrentAttempt(1);
    }
  }, [currentRequest]);

  const handleHistoryItemSelect = useCallback((item: HistoryItem) => {
    setPrompt(item.prompt);
    setStyle(item.style);
    // Set the generated image as the preview image for the live summary
    setImageDataUrl(item.imageUrl);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Studio
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Transform your images with AI-powered creativity. Upload, describe, and generate stunning variations in seconds.
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Input Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <ImageUpload onImageUpload={setImageDataUrl} />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <PromptInput 
                  value={prompt}
                  onChange={setPrompt}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <StyleSelector 
                  value={style}
                  onChange={setStyle}
                />
              </div>

              <GenerateButton
                onClick={() => handleGenerate()}
                onAbort={handleAbort}
                isLoading={isGenerating}
                isDisabled={!canGenerate}
                attempt={currentAttempt}
                maxAttempts={MAX_RETRY_ATTEMPTS}
              />
            </div>

            {/* Right Column - Preview and History */}
            <div className="lg:col-span-2 space-y-6">
              <LiveSummary
                imageDataUrl={imageDataUrl}
                prompt={prompt}
                style={style}
                className="bg-white rounded-xl shadow-sm border border-gray-200"
              />

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <History
                  items={history}
                  onItemSelect={handleHistoryItemSelect}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-500">
              AI Studio - Create stunning images with artificial intelligence
            </p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;