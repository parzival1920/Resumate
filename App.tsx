import React, { useState } from 'react';
import { AppState } from './types';
import { generateResumeBullets } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { Diamond, Code } from 'lucide-react';

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [bullets, setBullets] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);

  const handleSubmit = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) return;

    setAppState(AppState.LOADING);
    setErrorMsg(null);
    setBullets([]);

    try {
      const response = await generateResumeBullets(jobDescription, resumeText);
      
      if (response.error) {
        setErrorMsg(response.error);
        setAppState(AppState.ERROR);
      } else {
        setBullets(response.bullets);
        setAppState(AppState.SUCCESS);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setErrorMsg(null);
    setBullets([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Header */}
      <header className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-amber-400 group-hover:border-amber-500/50 transition-colors shadow-lg shadow-black/50">
              <Diamond size={20} className="fill-amber-400/20" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Resu<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">mate</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-medium tracking-wide">
             <span>Powered by Gemini AI</span>
             <Code size={12} className="text-zinc-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 md:py-16 relative">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10 opacity-50"></div>

        {/* Intro Text (Only show when IDLE) */}
        {appState === AppState.IDLE && (
          <div className="text-center mb-12 max-w-2xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
              Tailor Your Resume in Seconds
            </h2>
            <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400 font-light mb-4">
              Turn your resume into your strongest asset.
            </p>
            <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full opacity-80 mb-6"></div>
            <p className="text-base text-zinc-500 leading-relaxed max-w-lg mx-auto">
              Paste your resume and the job description below. We'll generate tailored, ATS-friendly bullet points to help you stand out.
            </p>
          </div>
        )}

        {/* Content Switcher */}
        <div className="transition-all duration-500 ease-in-out">
          {appState === AppState.IDLE || appState === AppState.LOADING ? (
            <InputForm
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              resumeText={resumeText}
              setResumeText={setResumeText}
              onSubmit={handleSubmit}
              isLoading={appState === AppState.LOADING}
            />
          ) : (
            <ResultDisplay
              bullets={bullets}
              error={errorMsg}
              onReset={handleReset}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-zinc-600">
          <p className="mb-2">© {new Date().getFullYear()} Resumate.</p> 
          <p className="text-zinc-700 text-xs">Designed for high-achieving students and professionals.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;