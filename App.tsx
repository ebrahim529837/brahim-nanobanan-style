import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { PromptInput } from './components/PromptInput';
import { Button } from './components/Button';
import { editImageWithGemini } from './services/geminiService';
import { AppStatus, GeneratedImageResult, SAMPLE_PROMPT, PresetPrompt } from './types';
import { Download, AlertCircle, Wand2, RefreshCw, Info } from 'lucide-react';

const PRESETS: PresetPrompt[] = [
  { label: "Cinematic Portrait", text: SAMPLE_PROMPT },
  { label: "Retro Filter", text: "Add a vintage 80s retro filter to this image, keep the subject same." },
  { label: "Cyberpunk", text: "Transform the background into a cyberpunk city, neon lights, night time, keep the person exactly as is." },
  { label: "Professional Headshot", text: "Make background a blurred professional office environment, improve lighting on face, keep identity strictly." },
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<GeneratedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (base64: string, type: string) => {
    setOriginalImage(base64);
    setMimeType(type);
    setResult(null);
    setError(null);
    setStatus(AppStatus.IDLE);
  };

  const handleClear = () => {
    setOriginalImage(null);
    setMimeType('');
    setPrompt('');
    setResult(null);
    setError(null);
    setStatus(AppStatus.IDLE);
  };

  const handleGenerate = async () => {
    if (!originalImage || !prompt.trim()) return;

    setStatus(AppStatus.PROCESSING);
    setError(null);
    setResult(null);

    try {
      const response = await editImageWithGemini(originalImage, mimeType, prompt);
      setResult(response);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the image.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `gemini-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Wand2 size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Nano Banana
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-medium px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
             Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 gap-8 flex flex-col lg:flex-row">
        
        {/* Left Column: Input & Controls */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">1</span>
                Upload Image
              </h2>
              {originalImage && (
                <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-300">
                  Reset All
                </button>
              )}
            </div>
            <ImageUpload 
              selectedImage={originalImage}
              onImageSelect={handleImageSelect}
              onClear={handleClear}
              disabled={status === AppStatus.PROCESSING}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">2</span>
                Describe Edits
              </h2>
            </div>
            
            <PromptInput 
              value={prompt}
              onChange={setPrompt}
              onGenerate={handleGenerate}
              isLoading={status === AppStatus.PROCESSING}
              disabled={!originalImage}
            />

            {/* Presets */}
            {originalImage && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Try a preset:</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(preset.text)}
                      disabled={status === AppStatus.PROCESSING}
                      className="px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700 text-xs text-slate-300 transition-all text-left truncate max-w-[200px]"
                      title={preset.text}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/50 text-red-200 flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

        </section>

        {/* Right Column: Results */}
        <section className="flex-1 min-w-0 bg-slate-900/30 rounded-2xl border border-slate-800 p-6 flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                Result
              </h2>
              {result?.imageUrl && (
                <Button variant="secondary" onClick={handleDownload} className="text-xs py-1.5 px-3 h-8">
                  <Download size={14} /> Download
                </Button>
              )}
           </div>

           <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-slate-950/50 rounded-xl border-2 border-dashed border-slate-800/50 relative overflow-hidden group">
              
              {status === AppStatus.IDLE && !result && (
                <div className="text-center p-8 text-slate-600">
                  <Wand2 size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Upload an image and describe your edits to see the magic happen.</p>
                </div>
              )}

              {status === AppStatus.PROCESSING && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <SparkleIcon className="text-indigo-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-6 text-indigo-300 font-medium animate-pulse">Gemini is reimagining your photo...</p>
                  <p className="text-slate-500 text-xs mt-2">This usually takes 5-10 seconds</p>
                </div>
              )}

              {result?.imageUrl && (
                <>
                  <img 
                    src={result.imageUrl} 
                    alt="Generated output" 
                    className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">Generated</span>
                  </div>
                </>
              )}
              
              {result?.text && !result.imageUrl && (
                 <div className="p-6 max-w-md text-center">
                    <Info size={40} className="mx-auto mb-4 text-amber-500" />
                    <h3 className="text-lg font-medium text-slate-200 mb-2">Text Response Received</h3>
                    <p className="text-slate-400 text-sm bg-slate-800 p-4 rounded-lg text-left font-mono border border-slate-700">
                      {result.text}
                    </p>
                    <p className="text-xs text-slate-500 mt-4">The model decided to reply with text instead of an image. Try adjusting your prompt to be more visual.</p>
                 </div>
              )}
           </div>
           
           {result?.imageUrl && (
             <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
               <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Used Prompt</h4>
               <p className="text-sm text-slate-300 italic">"{prompt}"</p>
             </div>
           )}
        </section>

      </main>
    </div>
  );
};

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

export default App;