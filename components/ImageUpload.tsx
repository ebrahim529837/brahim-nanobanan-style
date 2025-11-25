import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (base64: string, mimeType: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedImage,
  onImageSelect,
  onClear,
  disabled
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageSelect(result, file.type);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative group w-full h-full min-h-[300px] flex items-center justify-center bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
        <img 
          src={selectedImage} 
          alt="Original upload" 
          className="max-h-full max-w-full object-contain"
        />
        <button
          onClick={onClear}
          disabled={disabled}
          className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <X size={16} />
        </button>
        <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs text-white font-medium pointer-events-none">
          Original
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`w-full h-[300px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-200 cursor-pointer
        ${disabled 
          ? 'border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed' 
          : 'border-slate-600 bg-slate-800/30 hover:border-indigo-500 hover:bg-slate-800/50'
        }`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      <div className="p-4 rounded-full bg-slate-800 text-indigo-400">
        <Upload size={32} />
      </div>
      <div className="text-center px-4">
        <h3 className="text-lg font-medium text-slate-200">Upload your image</h3>
        <p className="text-sm text-slate-400 mt-1">Click to browse or drag & drop</p>
        <p className="text-xs text-slate-500 mt-2">Supports JPG, PNG, WEBP</p>
      </div>
    </div>
  );
};