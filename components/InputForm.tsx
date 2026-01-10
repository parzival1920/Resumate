import React from 'react';
import { Briefcase, FileText, Sparkles } from 'lucide-react';

interface InputFormProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  resumeText: string;
  setResumeText: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  jobDescription,
  setJobDescription,
  resumeText,
  setResumeText,
  onSubmit,
  isLoading,
}) => {
  const isFormValid = jobDescription.trim().length > 10 && resumeText.trim().length > 10;

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-xl shadow-black/50 border border-zinc-800 p-6 md:p-8 space-y-8 backdrop-blur-sm">
      <div className="space-y-6">
        <div>
          <label htmlFor="job-description" className="block text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" />
            Job Description
          </label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here (e.g., Responsibilities, Requirements)..."
            className="w-full h-40 p-4 text-zinc-100 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all resize-none text-sm leading-relaxed placeholder-zinc-600"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="resume-text" className="block text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Your Resume Text
          </label>
          <textarea
            id="resume-text"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            className="w-full h-40 p-4 text-zinc-100 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all resize-none text-sm leading-relaxed placeholder-zinc-600"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!isFormValid || isLoading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-zinc-950 shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden
          ${!isFormValid || isLoading 
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none border border-zinc-700' 
            : 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-[1.01] active:scale-[0.99]'
          }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
            <span>Refining...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate Premium Bullets</span>
          </>
        )}
      </button>
      
      {!isFormValid && (
        <p className="text-xs text-center text-zinc-500">
          Please enter at least a few words for both fields to proceed.
        </p>
      )}
    </div>
  );
};

export default InputForm;