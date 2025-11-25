import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onGenerate,
  isLoading,
  disabled
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
      <div className="relative bg-slate-900 rounded-xl p-1 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder="Describe how to edit the image... (e.g. 'Add a retro filter' or 'Make it snowy')"
          className="w-full bg-transparent text-white placeholder-slate-400 p-3 outline-none resize-none min-h-[60px] max-h-[200px] text-base"
          rows={1}
        />
        <button
          onClick={onGenerate}
          disabled={disabled || isLoading || !value.trim()}
          className="mb-1 mr-1 p-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Generate Image"
        >
          {isLoading ? (
             <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
          ) : (
            <Sparkles size={20} />
          )}
        </button>
      </div>
    </div>
  );
};