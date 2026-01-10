import React, { useState } from 'react';
import { Copy, Check, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

interface ResultDisplayProps {
  bullets: string[];
  error?: string | null;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ bullets, error, onReset }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = bullets.join('\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (error) {
    return (
      <div className="bg-zinc-900 rounded-2xl shadow-xl shadow-black/50 border border-red-900/30 p-8 space-y-6 text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/30">
           <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-zinc-100">Could Not Generate Bullets</h3>
        <p className="text-zinc-400 max-w-md mx-auto">{error}</p>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-200 font-medium rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-xl shadow-black/50 border border-zinc-800 p-6 md:p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">Tailored Resume Bullets</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Optimized for the job description provided.
          </p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:text-zinc-200 rounded-lg transition-colors flex items-center gap-2"
            >
                <RefreshCw className="w-4 h-4" />
                Start Over
            </button>
            <button
                onClick={handleCopyAll}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 border
                ${copiedAll 
                    ? 'bg-emerald-900/20 text-emerald-400 border-emerald-900/50' 
                    : 'bg-zinc-100 text-zinc-900 border-zinc-100 hover:bg-white hover:shadow-lg hover:shadow-white/10'}`}
            >
                {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedAll ? 'Copied' : 'Copy All'}
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {bullets.map((bullet, index) => (
          <div 
            key={index} 
            className="group relative p-5 bg-zinc-950/50 rounded-xl border border-zinc-800 hover:border-amber-500/30 hover:bg-zinc-950 hover:shadow-lg transition-all duration-300"
          >
            <div className="pr-10 text-zinc-300 leading-relaxed text-sm md:text-base font-light tracking-wide">
              <span className="text-amber-500 mr-2">•</span> {bullet}
            </div>
            <button
              onClick={() => handleCopy(bullet, index)}
              className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-amber-400 hover:bg-amber-900/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Copy bullet"
            >
              {copiedIndex === index ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-800 rounded-lg p-5 mt-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50"></div>
          <h4 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2">
            Pro Tip
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
              Review these bullets carefully. Ensure they accurately reflect your experience before adding them to your resume. Adjust metrics or details as needed to ensure authenticity.
          </p>
      </div>
    </div>
  );
};

export default ResultDisplay;