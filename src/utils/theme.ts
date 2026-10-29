import { PhosphorTheme } from '../types/terminal';

export interface ThemeConfig {
  name: string;
  textColor: string;
  textGlow: string;
  borderColor: string;
  bgColor: string;
  accentBg: string;
  promptColor: string;
  ghostColor: string;
  dimColor: string;
  cursorColor: string;
}

export const THEMES: Record<PhosphorTheme, ThemeConfig> = {
  green: {
    name: 'P1 Green Phosphor',
    textColor: 'text-[#33ff33]',
    textGlow: 'glow-text-green',
    borderColor: 'border-[#1a661a]',
    bgColor: 'bg-[#030903]',
    accentBg: 'bg-[#082008]',
    promptColor: 'text-[#66ff66]',
    ghostColor: 'text-[#55ff99]',
    dimColor: 'text-[#1d731d]',
    cursorColor: 'bg-[#33ff33]',
  },
  amber: {
    name: 'P3 Amber Phosphor',
    textColor: 'text-[#ffb000]',
    textGlow: 'glow-text-amber',
    borderColor: 'border-[#734f00]',
    bgColor: 'bg-[#0a0701]',
    accentBg: 'bg-[#261a03]',
    promptColor: 'text-[#ffd066]',
    ghostColor: 'text-[#ffaa33]',
    dimColor: 'text-[#8c6000]',
    cursorColor: 'bg-[#ffb000]',
  },
  cyan: {
    name: 'P4 Ice Cyan Phosphor',
    textColor: 'text-[#00f0ff]',
    textGlow: 'glow-text-cyan',
    borderColor: 'border-[#005f66]',
    bgColor: 'bg-[#01080a]',
    accentBg: 'bg-[#032026]',
    promptColor: 'text-[#66f6ff]',
    ghostColor: 'text-[#33e6ff]',
    dimColor: 'text-[#007b85]',
    cursorColor: 'bg-[#00f0ff]',
  },
};
