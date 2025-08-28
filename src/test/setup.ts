import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mocked-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(global, 'FileReader', {
  writable: true,
  value: class MockFileReader {
    result = 'data:image/jpeg;base64,mock';
    onload = vi.fn();
    onerror = vi.fn();
    
    readAsDataURL() {
      setTimeout(() => {
        if (this.onload) this.onload({ target: { result: this.result } });
      }, 0);
    }
  },
});

vi.mock('../utils/imageUtils', () => ({
  resizeImage: vi.fn(() => Promise.resolve('data:image/jpeg;base64,resized-mock')),
  createImagePreview: vi.fn(() => Promise.resolve('data:image/jpeg;base64,preview-mock')),
}));