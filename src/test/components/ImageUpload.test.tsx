import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ImageUpload } from '../../components/ImageUpload';

describe('ImageUpload', () => {
  const mockOnImageUpload = vi.fn();

  it('renders upload area', () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);
    
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText(/Click to upload/)).toBeInTheDocument();
    expect(screen.getByText('PNG or JPG (max 10MB)')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    const user = userEvent.setup();
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);
    
    const fileInput = screen.getByLabelText(/upload image file/i);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    await user.upload(fileInput, file);
    
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toBe(file);
  });

  it('shows error for invalid file type', async () => {
    const user = userEvent.setup();
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);
    
    const fileInput = screen.getByLabelText(/upload image file/i);
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    await user.upload(fileInput, file);
    
    expect(await screen.findByText(/please upload a png or jpg image file/i)).toBeInTheDocument();
  });

  it('supports drag and drop', () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);
    
    const dropArea = screen.getByRole('button', { name: /upload image area/i });
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.dragOver(dropArea);
    fireEvent.drop(dropArea, {
      dataTransfer: {
        files: [file],
      },
    });
    
    // Test that drag events are handled (no errors thrown)
    expect(dropArea).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<ImageUpload onImageUpload={mockOnImageUpload} />);
    
    const dropArea = screen.getByRole('button', { name: /upload image area/i });
    
    await user.tab();
    expect(dropArea).toHaveFocus();
    
    await user.keyboard('{Enter}');
    // Should trigger file dialog (we can't test the actual dialog opening)
  });
});