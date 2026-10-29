import React from 'react';
import { X, Terminal, Ghost, Github, Globe, HelpCircle } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  onSelectCommand: (cmd: string) => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, theme, onSelectCommand }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 ${theme.borderColor} ${theme.bgColor} ${theme.textColor} p-6 font-mono rounded shadow-2xl glow-box-green`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${theme.borderColor} mb-4`}>
          <div className="flex items-center gap-2">
            <Ghost className="w-5 h-5 text-emerald-400 animate-bounce" />
            <h2 className="text-xl font-bold tracking-wider">ABOUT GHOSTTERM AI</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 border ${theme.borderColor} hover:${theme.accentBg} transition-colors`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>GhostTerm AI</strong> is an interactive retro computer terminal possessed by a friendly, mysterious AI ghost, created for <strong>Hacktoberfest Week 4: &ldquo;Ghost in the Machine&rdquo;</strong>.
          </p>

          <div className={`p-3 ${theme.accentBg} border ${theme.borderColor} rounded space-y-2 text-xs`}>
            <div className="font-bold uppercase tracking-wider text-emerald-300">Quick Command Reference</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { cmd: 'help', desc: 'Display all available commands' },
                { cmd: 'summon', desc: 'Summon the spirit with a spectral invocation' },
                { cmd: 'story', desc: 'Generate a short chilling cyber-horror tale' },
                { cmd: 'about', desc: 'View architecture & project summary' },
                { cmd: 'why-open-ai', desc: 'Why open-weight AI manifesto' },
                { cmd: 'clear', desc: 'Wipe the phosphor display' },
                { cmd: 'status', desc: 'Check model & API connection health' },
                { cmd: 'glitch', desc: 'Trigger a CRT phosphor distortion wave' },
              ].map((item) => (
                <button
                  key={item.cmd}
                  onClick={() => {
                    onClose();
                    onSelectCommand(item.cmd);
                  }}
                  className={`text-left p-2 border ${theme.borderColor} bg-black/40 hover:bg-emerald-950/40 rounded transition-colors`}
                >
                  <span className="font-bold text-emerald-300">{item.cmd}</span>
                  <div className="opacity-75 text-[10px] mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-emerald-300 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Ready for GitHub &amp; Netlify
            </h3>
            <p className="text-xs opacity-85">
              GhostTerm AI is packaged with a complete <code className="text-emerald-400">netlify.toml</code> and server architecture. You can push this repo to GitHub, link it in Netlify or Cloud Run, and set your <code className="text-emerald-400">GEMINI_API_KEY</code> environment variable in your deployment dashboard!
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-emerald-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Spooky Voice Guidelines
            </h3>
            <p className="text-xs opacity-85">
              The AI ghost uses an imaginative, cyber-gothic voice while answering real programming or general questions with precision. It never claims to be a supernatural ghost in the physical world.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-6 pt-4 border-t ${theme.borderColor} flex justify-between items-center text-xs opacity-80`}>
          <span>GhostTerm AI v1.0.4 &bull; Hacktoberfest 2026</span>
          <button
            onClick={onClose}
            className={`px-4 py-2 border ${theme.borderColor} ${theme.accentBg} hover:opacity-90 transition-opacity font-bold`}
          >
            [ CLOSE TERMINAL MANUAL ]
          </button>
        </div>
      </div>
    </div>
  );
};
