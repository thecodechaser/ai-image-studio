import { GenerationRequest, GenerationResponse, GenerationError } from '../types';

const MOCK_IMAGES = [
  'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export const mockApiCall = async (request: GenerationRequest): Promise<GenerationResponse> => {
  // Simulate API delay
  const delay = Math.random() * 1000 + 1000; // 1-2 seconds
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // 20% chance of error
  if (Math.random() < 0.2) {
    throw new Error('Model overloaded');
  }
  
  // Return mock response
  const response: GenerationResponse = {
    id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
    prompt: request.prompt,
    style: request.style,
    createdAt: new Date().toISOString(),
  };
  
  return response;
};

export class AbortablePromise<T> {
  private abortController: AbortController;
  public promise: Promise<T>;

  constructor(executor: (resolve: (value: T) => void, reject: (reason?: any) => void, signal: AbortSignal) => void) {
    this.abortController = new AbortController();
    
    this.promise = new Promise<T>((resolve, reject) => {
      executor(resolve, reject, this.abortController.signal);
    });
  }

  abort() {
    this.abortController.abort();
  }
}

export const createAbortableMockApiCall = (request: GenerationRequest): AbortablePromise<GenerationResponse> => {
  return new AbortablePromise<GenerationResponse>((resolve, reject, signal) => {
    const delay = Math.random() * 1000 + 1000;
    
    const timeoutId = setTimeout(() => {
      if (signal.aborted) {
        reject(new Error('Request aborted'));
        return;
      }
      
      // 20% chance of error
      if (Math.random() < 0.2) {
        reject(new Error('Model overloaded'));
        return;
      }
      
      const response: GenerationResponse = {
        id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        imageUrl: MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
        prompt: request.prompt,
        style: request.style,
        createdAt: new Date().toISOString(),
      };
      
      resolve(response);
    }, delay);
    
    signal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new Error('Request aborted'));
    });
  });
};