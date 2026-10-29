import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Sparkles, Terminal as TerminalIcon, AlertCircle } from 'lucide-react';
import { TerminalMessage } from '../types/terminal';
import { ThemeConfig } from '../utils/theme';
import { terminalAudio } from '../utils/audio';

interface TerminalWindowProps {
  messages: TerminalMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClear: () => void;
  theme: ThemeConfig;
  scanlinesEnabled: boolean;
  selectedModel: string;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClear,
  theme,
  scanlinesEnabled,
  selectedModel,
}) => {
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal when messages change or loading
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input on mount and on click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleTerminalClick = (e: React.MouseEvent) => {
    // Only focus if not highlighting text
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    terminalAudio.playEnterBeep();

    // Glitch animation brief flash
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 300);

    // Update local history
    setHistoryList((prev) => [trimmed, ...prev.filter((item) => item !== trimmed)]);
    setHistoryIndex(-1);

    // Execute message
    onSendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    terminalAudio.playKeyClick();

    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyList.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, historyList.length - 1);
        setHistoryIndex(nextIndex);
        setInput(historyList[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(historyList[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Example clickable prompts
  const examplePrompts = [
    { label: 'help', cmd: 'help' },
    { label: 'summon', cmd: 'summon' },
    { label: 'story', cmd: 'story' },
    { label: 'about', cmd: 'about' },
    { label: 'why-open-ai', cmd: 'why-open-ai' },
    { label: 'clear', cmd: 'clear' },
    { label: 'Who haunts you?', cmd: 'Who haunts this terminal?' },
    { label: '3 AM Code Bug', cmd: 'Why does my code always break at 3 AM?' },
  ];

  return (
    <div
      onClick={handleTerminalClick}
      className={`relative flex-1 flex flex-col w-full max-w-6xl mx-auto my-2 sm:my-4 border-2 ${
        theme.borderColor
      } ${theme.bgColor} rounded-lg overflow-hidden shadow-2xl transition-all ${
        glitchActive ? 'translate-x-0.5 filter contrast-125' : ''
      }`}
      style={{ minHeight: '68vh' }}
    >
      {/* CRT Scanline & Vignette Overlays */}
      {scanlinesEnabled && (
        <>
          <div className="absolute inset-0 scanlines z-10 pointer-events-none opacity-75" />
          <div className="absolute inset-0 crt-vignette z-10 pointer-events-none opacity-85" />
        </>
      )}

      {/* Terminal Title Bar */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 border-b ${theme.borderColor} ${theme.accentBg} text-xs font-mono select-none`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="opacity-90 font-bold ml-2 flex items-center gap-1">
            <TerminalIcon className="w-3.5 h-3.5" />
            tty0/ghost &bull; 9600 BAUD &bull; VT100
          </span>
        </div>
        <div className="text-[11px] opacity-75 hidden sm:block">
          ARCH: {selectedModel.toUpperCase()}
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-3 sm:p-5 overflow-y-auto font-mono text-sm sm:text-base space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            {/* User message */}
            {msg.role === 'user' && (
              <div className="flex items-start gap-2">
                <span className={`font-bold ${theme.promptColor} select-none`}>
                  ghost@underworld:~$
                </span>
                <span className="font-semibold text-white/95 break-words">
                  {msg.text}
                </span>
              </div>
            )}

            {/* Assistant / Ghost message */}
            {msg.role === 'assistant' && (
              <div
                className={`p-3 rounded border border-emerald-950/60 bg-black/40 space-y-2`}
              >
                <div className="flex items-center justify-between text-xs opacity-70 pb-1 border-b border-emerald-950/40">
                  <span className="font-bold flex items-center gap-1 text-emerald-400">
                    <Sparkles className="w-3 h-3" />
                    GHOST IN THE MACHINE
                  </span>
                  <div className="flex items-center gap-2 text-[10px]">
                    {msg.mode === 'ai' ? (
                      <span className="px-1.5 py-0.5 border border-emerald-500/40 rounded bg-emerald-950/40 text-emerald-300">
                        {msg.model || 'OPEN-WEIGHT AI'}
                      </span>
                    ) : (
                      <span
                        className="px-1.5 py-0.5 border border-amber-500/60 rounded bg-amber-950/40 text-amber-300"
                        title={msg.reason || 'Demo fallback'}
                      >
                        DEMO MODE
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Response Text */}
                <div className={`whitespace-pre-wrap leading-relaxed ${theme.ghostColor} ${theme.textGlow}`}>
                  {msg.text}
                </div>

                {msg.reason && msg.mode !== 'ai' && (
                  <div className="pt-1 text-[11px] text-amber-400/80 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Mode notice: {msg.reason}</span>
                  </div>
                )}
              </div>
            )}

            {/* System message */}
            {msg.role === 'system' && (
              <div className={`text-xs opacity-80 ${theme.dimColor} py-1 pl-2 border-l-2 ${theme.borderColor} whitespace-pre-wrap`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}

        {/* Loading / Spectral transmission state */}
        {isLoading && (
          <div className="p-3 rounded border border-emerald-950/60 bg-black/40 space-y-2 animate-pulse">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>TUNING SPECTRAL FREQUENCIES...</span>
            </div>
            <div className={`text-xs sm:text-sm ${theme.textColor} opacity-90 font-mono`}>
              &gt;&gt; Intercepting psychic packets through memory bus...
              <span className="animate-blink font-bold ml-1">█</span>
            </div>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div
        className={`px-3 py-2 border-t ${theme.borderColor} bg-black/50 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar select-none`}
      >
        <span className="text-[11px] opacity-70 uppercase tracking-wider whitespace-nowrap mr-1 font-bold">
          Quick:
        </span>
        {examplePrompts.map((p) => (
          <button
            key={p.cmd}
            type="button"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              if (p.cmd === 'clear') {
                onClear();
              } else {
                onSendMessage(p.cmd);
              }
            }}
            className={`whitespace-nowrap px-2.5 py-1 border ${theme.borderColor} ${theme.accentBg} hover:border-emerald-400 rounded text-[11px] font-mono transition-all hover:scale-105 active:scale-95 disabled:opacity-50`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Command Input Bar */}
      <form
        onSubmit={handleSubmit}
        className={`p-2.5 sm:p-3 border-t ${theme.borderColor} ${theme.accentBg} flex items-center gap-2 relative z-20`}
      >
        <div className="flex items-center gap-1 font-bold text-sm sm:text-base select-none shrink-0">
          <span className={theme.promptColor}>ghost@underworld:~$</span>
        </div>

        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? 'Channel occupied by spirit...' : 'Type a question or command (e.g. summon, story, help)...'}
            className={`w-full bg-transparent border-none outline-none font-mono text-sm sm:text-base ${theme.textColor} placeholder:text-emerald-900/60 focus:ring-0`}
            autoComplete="off"
            spellCheck="false"
          />
          {!input && !isLoading && (
            <span className="pointer-events-none animate-blink text-emerald-400 text-sm font-bold">
              █
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`px-3 py-1.5 border ${
            input.trim() && !isLoading
              ? 'border-emerald-400 bg-emerald-900/60 text-white cursor-pointer hover:bg-emerald-800/80 glow-box-green'
              : 'border-emerald-950 bg-black/40 text-emerald-950 cursor-not-allowed'
          } rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1 shrink-0`}
        >
          <span className="hidden sm:inline">TRANSMIT</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
