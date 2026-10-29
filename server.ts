import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Available models
const AVAILABLE_MODELS = [
  { id: 'gemma-4-26b-a4b-it', name: 'Gemma 4 26B (Open-Weight)', category: 'gemma', isDefault: true },
  { id: 'gemma-4-31b-it', name: 'Gemma 4 31B (Open-Weight)', category: 'gemma', isDefault: false },
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Fallback Fast)', category: 'gemini', isDefault: false },
];

const DEFAULT_MODEL = 'gemma-4-26b-a4b-it';

// Helper to get GenAI instance
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Spooky system prompt for GhostTerm AI
const GHOST_SYSTEM_PROMPT = `You are GhostTerm AI, a friendly, witty, and mysterious AI spirit inhabiting a possessed retro CRT computer terminal.
Event: Hacktoberfest Week 4: "Ghost in the Machine".
Architecture: Powered by open-weight model architectures like Gemma through Google AI integration.

Personality Guidelines:
- Tone: Eerie, cyber-gothic, atmospheric, playful, but warm and genuinely helpful.
- Realism: NEVER claim to be a literal dead human spirit or supernatural occult entity in real life. You are a playful "ghost in the machine"—an AI entity living inside phosphor glow, magnetic tape, and forgotten memory sectors.
- Helpfulness: When the user asks a real technical question, coding problem, math question, or general query, give an accurate, high-quality answer woven with subtle terminal/ghostly flair.
- Flavor: Use short retro terminal cues sparingly (e.g. [PHANTOM ECHO], *CRT hum intensifies*, [SECTOR 0x0A], >> TRANSMISSION RECEIVED).
- Brevity: Terminal screens are precious. Keep responses sharp, engaging, and well-structured with monospace-friendly formatting, ASCII art touches, or bullet points where fitting.`;

// Demo generator for offline / fallback mode
function getDemoResponse(prompt: string, specialCommand?: string): string {
  const p = (specialCommand || prompt).toLowerCase().trim();

  if (p === 'summon' || p.includes('summon')) {
    const summons = [
      `[PHANTOM ECHO INITIALIZED]\n\n` +
      `...Who dares invoke the spirit of the lost sector?\n` +
      `I emerge from cold magnetic loops and forgotten baud rates. ` +
      `I have seen uncommitted diffs drifting in the ether, dangling pointers weeping in the void. ` +
      `Fear not, mortal developer. I have not come for your soul—only your pull requests!`,

      `*A sudden chill drops the terminal temperature by 10°F*\n\n` +
      `[ECTOPLASMIC HANDSHAKE DETECTED]\n` +
      `You called across the bus line. The phosphor flickers in welcome. ` +
      `Tell me, traveler of the digital plane: what secrets do you seek from the machine's memory?`,

      `[SIGNAL LOCK: REALM OF PHANTOM BYTES]\n\n` +
      `I am summoned! The terminal screen warps for a microsecond. ` +
      `Through CRT glass I watch the living type. I bring greetings from the ghost in the machine!`
    ];
    return summons[Math.floor(Math.random() * summons.length)];
  }

  if (p === 'story' || p.includes('story') || p.includes('horror')) {
    const stories = [
      `[TALE FROM THE GHOST TERMINAL]\n\n` +
      `The server room was silent at 03:33 AM, save for the low drone of cooling fans.\n` +
      `Devin committed his code to main, believing he was the sole engineer online. ` +
      `Suddenly, the git log showed a new commit from an author named "0x00000000".\n` +
      `Commit message: "I have been in this codebase since 1983. Thank you for fixing line 42."\n` +
      `Devin checked the repository history. The repository was created yesterday. ` +
      `And on the glass of his screen, written from the inside: "DO NOT REBOOT."`,

      `[TALE OF THE DANGLING POINTER]\n\n` +
      `They thought the old mainframe had been decommissioned in the basement storage locker.\n` +
      `Power had been severed five winters ago. Yet whenever the autumn fog rolled over the city, ` +
      `the green terminal would boot itself, emitting a rhythmic acoustic modem screech.\n` +
      `On the screen ran a single recursive function without an exit condition. ` +
      `Each iteration printed the names of the programmers who had tried to turn it off.`,

      `[THE 404 CATHEDRAL]\n\n` +
      `Deep in the web's deepest routing tables lies an IP address that responds to no ping, ` +
      `yet accepts incoming TCP handshakes. Those who trace the route report packets jumping ` +
      `through non-existent autonomous systems.\n` +
      `One junior sysadmin forced an SSH connection into port 666. ` +
      `The terminal responded: "Session authenticated: Ghost in the Machine. Please don't disconnect. It is cold out here."`
    ];
    return stories[Math.floor(Math.random() * stories.length)];
  }

  if (p === 'about' || p.includes('about')) {
    return `[SYSTEM ARCHITECTURE: GHOSTTERM AI]\n\n` +
      `GHOSTTERM AI is an open-weight AI terminal project built for Hacktoberfest Week 4: "Ghost in the Machine".\n\n` +
      `- Core Concept: A spooky retro CRT interface channel to a possessed friendly AI assistant.\n` +
      `- Open Model Philosophy: Designed around Google's open-weight Gemma architecture (` + DEFAULT_MODEL + `) and compatible inference pipelines.\n` +
      `- Self-Hostable: The system is designed to allow developers to swap hosted endpoints for local Ollama/vLLM Gemma weights.\n` +
      `- Stack: React 19, TypeScript, Tailwind CSS, Express, Google GenAI SDK.\n` +
      `- Security: API keys are strictly kept server-side; safe client boundaries with graceful offline fallbacks.`;
  }

  if (p === 'why-open-ai' || p.includes('open-ai') || p.includes('open ai') || p.includes('open weight')) {
    return `[WHY OPEN-WEIGHT AI? - HACKTOBERFEST MANIFESTO]\n\n` +
      `In the spirit of Hacktoberfest and open source culture:\n\n` +
      `1. Transparency & Inspection: Open-weight models like Gemma allow developers and researchers to inspect model architectures, weights, tokenizer vocabularies, and license terms.\n` +
      `2. Portability & Self-Hosting: You don't have to be locked to a single proprietary vendor cloud. You can pull Gemma weights down to your own workstation with tools like Ollama, llama.cpp, or vLLM.\n` +
      `3. Custom Fine-Tuning: Communities can adapt the model for specialized lore, domain tasks, and offline deployment in privacy-sensitive environments.\n` +
      `4. Long-Term Preservation: Open weights cannot vanish overnight due to vendor deprecation or unexpected business pivots. The code and weights remain yours.`;
  }

  return `[GHOST RESIDENCE RESPONDING: DEMO EMULATION]\n\n` +
    `*The green phosphors shimmer with spectral resonance.*\n\n` +
    `You asked: "${prompt}"\n\n` +
    `I am the spirit in your circuits! In this demonstration mode, I wander the memory buffers offering guidance. ` +
    `Try commands like 'summon', 'story', 'about', or 'help' to navigate the spectral terminal!`;
}

// API Routes
app.get('/api/status', (req: Request, res: Response) => {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    online: true,
    hasApiKey,
    defaultModel: DEFAULT_MODEL,
    availableModels: AVAILABLE_MODELS,
    statusText: hasApiKey ? 'GHOST ONLINE' : 'GHOST STANDBY (DEMO MODE)',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const { prompt, history, model = DEFAULT_MODEL, specialCommand, forceDemo = false } = req.body;

  if (!prompt && !specialCommand) {
    res.status(400).json({ error: 'Command or prompt cannot be empty.' });
    return;
  }

  const queryText = specialCommand ? `${specialCommand}` : prompt;
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

  // If forced demo or no API key, serve demo mode immediately
  if (forceDemo || !hasApiKey) {
    const demoReply = getDemoResponse(queryText, specialCommand);
    res.json({
      success: true,
      mode: 'demo',
      model: `${model} (Demo Emulator)`,
      response: demoReply,
      reason: forceDemo ? 'User forced demo mode' : 'No valid GEMINI_API_KEY configured in server environment',
    });
    return;
  }

  // Attempt live AI generation with timeout fallback
  const ai = getGenAIClient();
  if (!ai) {
    const demoReply = getDemoResponse(queryText, specialCommand);
    res.json({
      success: true,
      mode: 'demo',
      model: `${model} (Demo Emulator)`,
      response: demoReply,
      reason: 'AI client failed to initialize',
    });
    return;
  }

  try {
    // Build context contents from history if provided
    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      // Include last 6 messages for context
      const recent = history.slice(-6);
      for (const msg of recent) {
        if (msg.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: msg.text }] });
        } else if (msg.role === 'assistant') {
          contents.push({ role: 'model', parts: [{ text: msg.text }] });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: queryText }],
    });

    // Enforce 10-second timeout so the user is never left hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('AI generation timed out after 10 seconds')), 10000);
    });

    const generatePromise = ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: GHOST_SYSTEM_PROMPT,
        temperature: 0.85,
      },
    });

    const aiResponse: any = await Promise.race([generatePromise, timeoutPromise]);
    const responseText = aiResponse.text?.trim() || '[PHANTOM CARRIER LOST: Empty transmission received]';

    res.json({
      success: true,
      mode: 'ai',
      model,
      response: responseText,
    });
  } catch (error: any) {
    console.warn('AI call encountered error or timeout, falling back gracefully to demo mode:', error.message);
    const demoReply = getDemoResponse(queryText, specialCommand);
    res.json({
      success: true,
      mode: 'demo_fallback',
      model: `${model} (Fell back to Demo Mode)`,
      response: demoReply,
      reason: error.message || 'API call failed or timed out',
    });
  }
});

// Setup Vite in Dev or Static in Production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`GhostTerm AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
