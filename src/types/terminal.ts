export type MessageRole = 'user' | 'assistant' | 'system';

export type ResponseMode = 'ai' | 'demo' | 'demo_fallback' | 'system';

export interface TerminalMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: string;
  mode?: ResponseMode;
  model?: string;
  command?: string;
  reason?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  category: string;
  isDefault: boolean;
}

export interface ServerStatus {
  online: boolean;
  hasApiKey: boolean;
  defaultModel: string;
  availableModels: ModelOption[];
  statusText: string;
  timestamp: string;
}

export type PhosphorTheme = 'green' | 'amber' | 'cyan';
