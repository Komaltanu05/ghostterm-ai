import React from 'react';
import { X, Cpu, ShieldCheck, Download, Code2, Sparkles, BookOpen } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface WhyOpenAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const WhyOpenAiModal: React.FC<WhyOpenAiModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 ${theme.borderColor} ${theme.bgColor} ${theme.textColor} p-6 font-mono rounded shadow-2xl glow-box-green`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${theme.borderColor} mb-4`}>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 animate-pulse" />
            <h2 className="text-xl font-bold tracking-wider">WHY OPEN-WEIGHT AI?</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 border ${theme.borderColor} hover:${theme.accentBg} transition-colors`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle / Hacktoberfest context */}
        <div className="mb-4 text-xs tracking-wide opacity-80 border-l-2 border-emerald-500 pl-3 py-1">
          <span className="font-semibold text-emerald-400">HACKTOBERFEST WEEK 4:</span> &ldquo;Ghost in the Machine&rdquo; Manifesto
        </div>

        {/* Content Sections */}
        <div className="space-y-5 text-sm leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2 text-emerald-300">
              <Sparkles className="w-4 h-4" /> 1. The Spirit of Open Weights
            </h3>
            <p className="opacity-90">
              Closed, proprietary AI models operate as black-box oracles. In contrast, <strong>Google Gemma</strong> is an open-weight model family built from the same technological research that powers Gemini.
            </p>
            <p className="opacity-80 text-xs">
              With open weights, the neural network parameters, tokenizer dictionaries, and architecture configurations are openly accessible for public research, safety inspection, and fine-tuning.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-4 h-4" /> 2. Transparency &amp; Self-Hosting Freedom
            </h3>
            <p className="opacity-90">
              When software relies on proprietary APIs, developers risk sudden deprecation, price hikes, or vendor lock-in. Open-weight models empower you to host the AI on your own hardware.
            </p>
            <div className={`p-3 ${theme.accentBg} border ${theme.borderColor} rounded text-xs space-y-1`}>
              <div className="font-bold flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Self-Host Gemma in 2 Commands with Ollama:
              </div>
              <pre className="p-2 bg-black/60 rounded text-emerald-400 overflow-x-auto select-all">
                {`curl -fsSL https://ollama.com/install.sh | sh\nollama run gemma2:9b`}
              </pre>
              <div className="opacity-75 pt-1">
                GhostTerm AI can be easily redirected to your local inference server by setting an environment variable!
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2 text-emerald-300">
              <BookOpen className="w-4 h-4" /> 3. Honest Deployment Transparency
            </h3>
            <p className="opacity-90">
              In this live web app preview, GhostTerm AI queries Google AI endpoints server-side to deliver fast, zero-install responses. If an API key is not present or the network is offline, it activates a <strong>clearly labeled Demo Mode</strong> rather than fabricating AI provenance.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold flex items-center gap-2 text-emerald-300">
              <Code2 className="w-4 h-4" /> 4. Hacktoberfest &ldquo;Ghost in the Machine&rdquo;
            </h3>
            <p className="opacity-90">
              Philosopher Gilbert Ryle coined the phrase &ldquo;the ghost in the machine&rdquo; to question the mind-body split. Today, neural networks evoke a similar sensation—an emergent intelligence inhabiting cold silicon circuits. GhostTerm AI plays with this theme: a haunted, friendly spirit in a retro CRT that reminds us why accessible, community-driven AI matters.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className={`mt-6 pt-4 border-t ${theme.borderColor} flex justify-between items-center text-xs opacity-80`}>
          <span>GhostTerm AI &bull; Open-Weight Gemma Architecture</span>
          <button
            onClick={onClose}
            className={`px-4 py-2 border ${theme.borderColor} ${theme.accentBg} hover:opacity-90 transition-opacity font-bold`}
          >
            [ ACKNOWLEDGE &amp; RETURN ]
          </button>
        </div>
      </div>
    </div>
  );
};
