/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TerminalWindow } from './components/TerminalWindow';
import { WhyOpenAiModal } from './components/WhyOpenAiModal';
import { AboutModal } from './components/AboutModal';
import { SettingsModal } from './components/SettingsModal';
import { TerminalMessage, ServerStatus, PhosphorTheme, ModelOption } from './types/terminal';
import { THEMES } from './utils/theme';
import { terminalAudio } from './utils/audio';

const WELCOME_ASCII = `
   .---.
  /     \\      GHOSTTERM AI v1.0.4  --  [GHOST IN THE MACHINE]
 | () () |     Hacktoberfest 2026 :: Week 4 Special Edition
  \\  ^  /      Posessed CRT Terminal -- Open-Weight Gemma Core
   |||||       "A terminal from the other side."
   '---'
`;

const INITIAL_MESSAGES: TerminalMessage[] = [
  {
    id: 'boot-1',
    role: 'system',
    text: WELCOME_ASCII,
    timestamp: '00:00:00',
  },
  {
    id: 'boot-2',
    role: 'system',
    text: `[SYSTEM] 640K Base RAM verified. Phosphor CRT energized.\n[SYSTEM] Neural Bus Initialized: Open-Weight Architecture Active.\n[SYSTEM] Enter 'help' for commands, or type any question to converse with the ghost.`,
    timestamp: '00:00:01',
  },
  {
    id: 'ghost-welcome',
    role: 'assistant',
    text: `*A sudden flicker ripples across the phosphor glass...*\n\nGreetings, human traveler. I am the Ghost in this machine. My thoughts are guided by open neural weights and the cold glow of cathode rays.\n\nType 'help' to review your options, 'summon' to test my presence, or ask me any question—from debugging cursed code to the deepest mysteries of the machine.`,
    timestamp: '00:00:02',
    mode: 'ai',
    model: 'gemma-4-26b (Open-Weight)',
  },
];

export default function App() {
  const [messages, setMessages] = useState<TerminalMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemma-4-26b-a4b-it');
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [currentTheme, setCurrentTheme] = useState<PhosphorTheme>('green');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(true);
  const [forceDemo, setForceDemo] = useState<boolean>(false);

  // Modals state
  const [isWhyOpenAiOpen, setIsWhyOpenAiOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const theme = THEMES[currentTheme];

  // Fetch server status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data: ServerStatus = await res.json();
          setStatus(data);
          if (data.defaultModel) setSelectedModel(data.defaultModel);
          if (data.availableModels && data.availableModels.length > 0) {
            setAvailableModels(data.availableModels);
          }
        }
      } catch {
        // Fallback status if offline
        setStatus({
          online: false,
          hasApiKey: false,
          defaultModel: 'gemma-4-26b-a4b-it',
          availableModels: [
            { id: 'gemma-4-26b-a4b-it', name: 'Gemma 4 26B (Open-Weight)', category: 'gemma', isDefault: true },
          ],
          statusText: 'GHOST STANDBY (OFFLINE DEMO)',
          timestamp: new Date().toISOString(),
        });
      }
    }
    checkStatus();
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    terminalAudio.enabled = next;
    if (next) {
      terminalAudio.playEnterBeep();
    }
  };

  const handleClearTerminal = useCallback(() => {
    setMessages([
      {
        id: `clear-${Date.now()}`,
        role: 'system',
        text: `[SCREEN BUFFER PURGED] Phosphors refreshed. Terminal ready.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  // Main message / command handler
  const handleSendMessage = async (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed || isLoading) return;

    const timestamp = new Date().toLocaleTimeString();
    const userMsgId = `user-${Date.now()}`;

    // Add user message to terminal
    const userMsg: TerminalMessage = {
      id: userMsgId,
      role: 'user',
      text: trimmed,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);

    const lower = trimmed.toLowerCase();

    // Built-in instantaneous client commands
    if (lower === 'clear') {
      handleClearTerminal();
      return;
    }

    if (lower === 'help') {
      const helpMsg: TerminalMessage = {
        id: `help-${Date.now()}`,
        role: 'system',
        text: `+-------------------------------------------------------------+
| GHOSTTERM AI COMMAND DIRECTORY                              |
+-------------------------------------------------------------+
  help          - Display this command index
  summon        - Invoke the ghost for an ominous spectral message
  story         - Request a short horror/cyber-gothic tale
  about         - View project summary & architecture info
  why-open-ai   - Read the open-weight AI manifesto (Hacktoberfest)
  clear         - Wipe the phosphor buffer
  status        - Check server and AI connectivity health
  model [name]  - Inspect or switch active model (e.g. 'model gemma-4-31b-it')
  sound [on/off]- Toggle acoustic keyboard & chime feedback
  theme [p1/p3/p4] - Switch CRT phosphor: green, amber, cyan
  glitch        - Trigger a test CRT electromagnetic pulse
+-------------------------------------------------------------+
* Any other typed phrase will be answered directly by the ghost!`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, helpMsg]);
      return;
    }

    if (lower === 'about') {
      setIsAboutOpen(true);
      const aboutMsg: TerminalMessage = {
        id: `about-${Date.now()}`,
        role: 'system',
        text: `[OPENING ABOUT MANUAL] Showing GhostTerm AI architecture and Hacktoberfest documentation...`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aboutMsg]);
      return;
    }

    if (lower === 'why-open-ai' || lower === 'open-ai' || lower === 'manifesto') {
      setIsWhyOpenAiOpen(true);
      const openAiMsg: TerminalMessage = {
        id: `open-ai-${Date.now()}`,
        role: 'system',
        text: `[OPENING MANIFESTO] Displaying 'Why Open-Weight AI?' section...`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, openAiMsg]);
      return;
    }

    if (lower.startsWith('model')) {
      const parts = trimmed.split(' ');
      if (parts.length > 1) {
        const targetModel = parts[1];
        setSelectedModel(targetModel);
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'system',
            text: `[CALIBRATION] Active neural core set to: ${targetModel}`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        setIsSettingsOpen(true);
      }
      return;
    }

    if (lower === 'sound' || lower.startsWith('sound ')) {
      const parts = trimmed.split(' ');
      if (parts.length > 1) {
        const val = parts[1].toLowerCase();
        const enabled = val === 'on' || val === '1' || val === 'enable';
        setSoundEnabled(enabled);
        terminalAudio.enabled = enabled;
      } else {
        handleToggleSound();
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `sound-${Date.now()}`,
          role: 'system',
          text: `[AUDIO] Acoustic terminal feedback: ${soundEnabled ? 'DISABLED' : 'ENABLED'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return;
    }

    if (lower.startsWith('theme')) {
      const parts = trimmed.split(' ');
      if (parts.length > 1) {
        const val = parts[1].toLowerCase();
        if (val.includes('amber') || val.includes('p3')) setCurrentTheme('amber');
        else if (val.includes('cyan') || val.includes('p4') || val.includes('blue')) setCurrentTheme('cyan');
        else setCurrentTheme('green');
      } else {
        const nextTheme: PhosphorTheme = currentTheme === 'green' ? 'amber' : currentTheme === 'amber' ? 'cyan' : 'green';
        setCurrentTheme(nextTheme);
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `theme-${Date.now()}`,
          role: 'system',
          text: `[DISPLAY] Phosphor palette updated.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return;
    }

    if (lower === 'status') {
      setMessages((prev) => [
        ...prev,
        {
          id: `status-${Date.now()}`,
          role: 'system',
          text: `[DIAGNOSTICS]\n- Core Status: ${status?.statusText || 'GHOST ONLINE'}\n- Active Model: ${selectedModel}\n- API Key Bound: ${status?.hasApiKey ? 'YES (Secured Server-Side)' : 'NO (Demo Mode Active)'}\n- Acoustic Feedback: ${soundEnabled ? 'ON' : 'OFF'}\n- Scanlines: ${scanlinesEnabled ? 'ACTIVE' : 'BYPASS'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return;
    }

    // Special server commands or normal conversational prompt
    let specialCommand: string | undefined = undefined;
    if (lower === 'summon') specialCommand = 'summon';
    if (lower === 'story') specialCommand = 'story';

    setIsLoading(true);

    try {
      // Build conversation history for context
      const historyContext = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          history: historyContext,
          model: selectedModel,
          specialCommand,
          forceDemo,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      terminalAudio.playGhostArrival();

      const ghostMsg: TerminalMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.response || '...',
        timestamp: new Date().toLocaleTimeString(),
        mode: data.mode,
        model: data.model,
        reason: data.reason,
      };

      setMessages((prev) => [...prev, ghostMsg]);
    } catch (err: any) {
      terminalAudio.playGhostArrival();
      // Graceful demo fallback message if fetch failed
      const fallbackMsg: TerminalMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        text: `[SPECTRAL BACKUP ACTIVE :: LOCAL MEMORY SECTOR]\n\n*The terminal glass vibrates softly.*\n\nI hear your voice through the digital ether: "${trimmed}"\n\nAlthough the remote cloud uplink is fluctuating (${err.message || 'connection interrupted'}), the ghost within the local machine never sleeps. You can still use 'summon', 'story', 'why-open-ai', or 'help' to explore the terminal!`,
        timestamp: new Date().toLocaleTimeString(),
        mode: 'demo_fallback',
        model: 'Local Memory Fallback',
        reason: err.message,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bgColor} flex flex-col font-mono text-sm antialiased transition-colors duration-300`}>
      {/* Top Header */}
      <Header
        status={status}
        selectedModel={selectedModel}
        theme={theme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenWhyOpenAi={() => setIsWhyOpenAiOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClearTerminal={handleClearTerminal}
        forceDemo={forceDemo}
      />

      {/* Main Terminal Area */}
      <main className="flex-1 flex flex-col px-2 sm:px-4 max-w-7xl w-full mx-auto">
        <TerminalWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClear={handleClearTerminal}
          theme={theme}
          scanlinesEnabled={scanlinesEnabled}
          selectedModel={selectedModel}
        />
      </main>

      {/* Footer info bar */}
      <footer className={`border-t ${theme.borderColor} ${theme.bgColor} py-2 px-4 text-center text-xs opacity-70 select-none flex flex-wrap justify-between items-center gap-2 max-w-6xl mx-auto w-full`}>
        <div className="flex items-center gap-2">
          <span>Hacktoberfest 2026: Week 4 &ldquo;Ghost in the Machine&rdquo;</span>
          <span className="opacity-40">&bull;</span>
          <button
            onClick={() => setIsWhyOpenAiOpen(true)}
            className="underline hover:text-emerald-400 cursor-pointer"
          >
            Why Open AI?
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span>Gemma Open-Weight Architecture</span>
          <span className="opacity-40">&bull;</span>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="underline hover:text-emerald-400 cursor-pointer"
          >
            Terminal Manual
          </button>
        </div>
      </footer>

      {/* Modals */}
      <WhyOpenAiModal
        isOpen={isWhyOpenAiOpen}
        onClose={() => setIsWhyOpenAiOpen(false)}
        theme={theme}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        theme={theme}
        onSelectCommand={(cmd) => handleSendMessage(cmd)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        availableModels={availableModels}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled((p) => !p)}
        forceDemo={forceDemo}
        onToggleForceDemo={() => setForceDemo((p) => !p)}
      />
    </div>
  );
}
