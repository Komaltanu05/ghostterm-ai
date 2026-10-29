import React from 'react';
import { Ghost, Terminal, Volume2, VolumeX, Settings, Cpu, HelpCircle, Sparkles } from 'lucide-react';
import { ServerStatus } from '../types/terminal';
import { ThemeConfig } from '../utils/theme';

interface HeaderProps {
  status: ServerStatus | null;
  selectedModel: string;
  theme: ThemeConfig;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWhyOpenAi: () => void;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
  onClearTerminal: () => void;
  forceDemo: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  selectedModel,
  theme,
  soundEnabled,
  onToggleSound,
  onOpenWhyOpenAi,
  onOpenAbout,
  onOpenSettings,
  onClearTerminal,
  forceDemo,
}) => {
  const isOnline = status?.online ?? false;
  const isDemo = forceDemo || (!status?.hasApiKey);

  return (
    <header className={`w-full border-b ${theme.borderColor} ${theme.bgColor} px-4 py-3 select-none`}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center p-2 rounded bg-black/60 border border-emerald-500/40 animate-ghost-pulse">
            <Ghost className="w-6 h-6 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-black tracking-widest ${theme.textGlow}`}>
                GHOSTTERM AI
              </h1>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-emerald-500/50 rounded bg-emerald-950/40 text-emerald-300 hidden sm:inline-block">
                HACKTOBERFEST &apos;26
              </span>
            </div>
            <p className="text-xs sm:text-sm tracking-wide opacity-80">
              A terminal from the other side.
            </p>
          </div>
        </div>

        {/* Status & Control Buttons */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Status Indicator */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 border rounded ${
              isDemo
                ? 'border-amber-500/60 bg-amber-950/30 text-amber-300'
                : 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300'
            }`}
            title={isDemo ? 'Running in Demo Emulator mode' : 'Connected to server API'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDemo ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="font-bold tracking-wider">
              {isDemo ? 'GHOST STANDBY' : 'GHOST ONLINE'}
            </span>
          </div>

          {/* Model Badge */}
          <button
            onClick={onOpenSettings}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 border ${theme.borderColor} ${theme.accentBg} hover:opacity-90 rounded transition-opacity`}
            title="Configure AI model architecture"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[11px] truncate max-w-[120px] sm:max-w-[160px]">
              {selectedModel.replace('-it', '').replace('models/', '')}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 border ${theme.borderColor} ${theme.accentBg} hover:opacity-90 rounded transition-opacity`}
            title={soundEnabled ? 'Mute terminal audio' : 'Enable retro audio feedback'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 opacity-60" />}
          </button>

          {/* Why Open AI? button */}
          <button
            onClick={onOpenWhyOpenAi}
            className={`flex items-center gap-1 px-2.5 py-1.5 border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 rounded font-bold transition-colors`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Why Open AI?</span>
          </button>

          {/* About / Help */}
          <button
            onClick={onOpenAbout}
            className={`p-1.5 border ${theme.borderColor} ${theme.accentBg} hover:opacity-90 rounded transition-opacity`}
            title="About GhostTerm AI & command manual"
            aria-label="Open About Modal"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings / Calibration */}
          <button
            onClick={onOpenSettings}
            className={`p-1.5 border ${theme.borderColor} ${theme.accentBg} hover:opacity-90 rounded transition-opacity`}
            title="Terminal calibration & settings"
            aria-label="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
