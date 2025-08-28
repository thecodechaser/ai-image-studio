import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';

// Mock the mock API
vi.mock('../utils/mockApi', () => ({
  createAbortableMockApiCall: vi.fn(() => ({
    promise: Promise.resolve({
      id: 'test-id',
      imageUrl: 'https://example.com/image.jpg',
      prompt: 'test prompt',
      style: 'Editorial',
      createdAt: new Date().toISOString(),
    }),
    abort: vi.fn(),
  })),
}));

describe('App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders the main header', () => {
    render(<App />);
    
    expect(screen.getByText('AI Studio')).toBeInTheDocument();
    expect(screen.getByText(/Transform your images with AI-powered creativity/)).toBeInTheDocument();
  });

  it('shows empty states when no content is provided', () => {
    render(<App />);
    
    expect(screen.getByText('Upload an image and add a prompt to see your creation summary')).toBeInTheDocument();
    expect(screen.getByText('Your recent generations will appear here')).toBeInTheDocument();
  });

  it('enables generate button when image and prompt are provided', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const generateButton = screen.getByRole('button', { name: /generate/i });
    expect(generateButton).toBeDisabled();
    
    const promptInput = screen.getByLabelText(/prompt/i);
    await user.type(promptInput, 'A beautiful landscape');
    
    expect(generateButton).toBeDisabled();
    
    const fileInput = screen.getByLabelText(/upload image file/i);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(generateButton).not.toBeDisabled();
    });
  });

  it('updates style selection', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const styleSelect = screen.getByLabelText(/style/i);
    
    await user.selectOptions(styleSelect, 'Vintage');
    
    expect(styleSelect).toHaveValue('Vintage');
    expect(screen.getByText('Classic, retro aesthetic')).toBeInTheDocument();
  });

  it('shows live preview when content is added', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const promptInput = screen.getByLabelText(/prompt/i);
    await user.type(promptInput, 'Test prompt');
    
    expect(screen.getByText('Live Preview')).toBeInTheDocument();
    expect(screen.getByText('Test prompt', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Editorial')).toBeInTheDocument();
  });
});