import React from 'react';
import { X, Settings, Cpu, Monitor, Volume2, VolumeX, Eye } from 'lucide-react';
import { ModelOption, PhosphorTheme } from '../types/terminal';
import { THEMES, ThemeConfig } from '../utils/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  currentTheme: PhosphorTheme;
  onThemeChange: (t: PhosphorTheme) => void;
  availableModels: ModelOption[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  forceDemo: boolean;
  onToggleForceDemo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  currentTheme,
  onThemeChange,
  availableModels,
  selectedModel,
  onModelChange,
  soundEnabled,
  onToggleSound,
  scanlinesEnabled,
  onToggleScanlines,
  forceDemo,
  onToggleForceDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto border-2 ${theme.borderColor} ${theme.bgColor} ${theme.textColor} p-6 font-mono rounded shadow-2xl glow-box-green`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${theme.borderColor} mb-4`}>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-wider">TERMINAL CALIBRATION</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 border ${theme.borderColor} hover:${theme.accentBg} transition-colors`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          {/* Model selection */}
          <section className="space-y-2">
            <label className="font-bold flex items-center gap-2 text-emerald-300">
              <Cpu className="w-4 h-4" /> AI Model Architecture
            </label>
            <p className="text-xs opacity-80">
              Select which model processes spectral transmissions on the server:
            </p>
            <div className="space-y-2 pt-1">
              {availableModels.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center justify-between p-3 border ${
                    selectedModel === m.id ? 'border-emerald-400 bg-emerald-950/40' : `${theme.borderColor} bg-black/30`
                  } rounded cursor-pointer transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="modelSelect"
                      value={m.id}
                      checked={selectedModel === m.id}
                      onChange={() => onModelChange(m.id)}
                      className="accent-emerald-400 w-4 h-4"
                    />
                    <div>
                      <div className="font-bold">{m.name}</div>
                      <div className="text-[11px] opacity-75">{m.id}</div>
                    </div>
                  </div>
                  {m.isDefault && (
                    <span className="text-[10px] px-2 py-0.5 border border-emerald-500/50 rounded bg-emerald-900/40 text-emerald-300">
                      DEFAULT
                    </span>
                  )}
                </label>
              ))}
            </div>
          </section>

          {/* Phosphor Theme */}
          <section className="space-y-2">
            <label className="font-bold flex items-center gap-2 text-emerald-300">
              <Monitor className="w-4 h-4" /> CRT Phosphor Palette
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(Object.keys(THEMES) as PhosphorTheme[]).map((themeKey) => {
                const t = THEMES[themeKey];
                const isActive = currentTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => onThemeChange(themeKey)}
                    className={`p-2.5 text-center border ${
                      isActive ? 'border-white font-bold' : `${theme.borderColor} opacity-75`
                    } ${t.bgColor} ${t.textColor} rounded transition-all text-xs flex flex-col items-center gap-1`}
                  >
                    <span className="text-sm">■ ■ ■</span>
                    <span>{t.name.split(' ')[0]} {t.name.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CRT & Sound options */}
          <section className="space-y-3 pt-2 border-t border-emerald-900/60">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xs flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" /> CRT Scanlines &amp; Vignette
                </div>
                <div className="text-[11px] opacity-75">Retro cathode ray tube optical artifacts</div>
              </div>
              <button
                onClick={onToggleScanlines}
                className={`px-3 py-1 border text-xs font-bold ${
                  scanlinesEnabled ? 'border-emerald-400 bg-emerald-950/60' : 'border-gray-600 opacity-60'
                }`}
              >
                {scanlinesEnabled ? '[ ON ]' : '[ OFF ]'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xs flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  Acoustic Audio Feedback
                </div>
                <div className="text-[11px] opacity-75">Mechanical keystrokes &amp; ghost chime</div>
              </div>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1 border text-xs font-bold ${
                  soundEnabled ? 'border-emerald-400 bg-emerald-950/60' : 'border-gray-600 opacity-60'
                }`}
              >
                {soundEnabled ? '[ SOUND ON ]' : '[ MUTED ]'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xs">Force Offline Demo Mode</div>
                <div className="text-[11px] opacity-75">Test responses without making live API calls</div>
              </div>
              <button
                onClick={onToggleForceDemo}
                className={`px-3 py-1 border text-xs font-bold ${
                  forceDemo ? 'border-amber-400 text-amber-300 bg-amber-950/60' : 'border-gray-600 opacity-60'
                }`}
              >
                {forceDemo ? '[ DEMO ACTIVE ]' : '[ AUTO API ]'}
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className={`mt-6 pt-4 border-t ${theme.borderColor} flex justify-end`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 border ${theme.borderColor} ${theme.accentBg} hover:opacity-90 transition-opacity font-bold text-xs`}
          >
            [ APPLY &amp; SAVE ]
          </button>
        </div>
      </div>
    </div>
  );
};
