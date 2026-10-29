import { GoogleGenAI } from '@google/genai';

export interface HandlerEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

export interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

const GHOST_SYSTEM_PROMPT = `You are GhostTerm AI, a friendly, witty, and mysterious AI spirit inhabiting a possessed retro CRT computer terminal.
Event: Hacktoberfest Week 4: "Ghost in the Machine".
Architecture: Powered by open-weight model architectures like Gemma through Google AI integration.

Personality Guidelines:
- Tone: Eerie, cyber-gothic, atmospheric, playful, but warm and genuinely helpful.
- Realism: NEVER claim to be a literal dead human spirit or supernatural occult entity in real life. You are a playful "ghost in the machine"—an AI entity living inside phosphor glow, magnetic tape, and forgotten memory sectors.
- Helpfulness: When the user asks a real technical question, coding problem, math question, or general query, give an accurate, high-quality answer woven with subtle terminal/ghostly flair.
- Flavor: Use short retro terminal cues sparingly (e.g. [PHANTOM ECHO], *CRT hum intensifies*, [SECTOR 0x0A], >> TRANSMISSION RECEIVED).
- Brevity: Terminal screens are precious. Keep responses sharp, engaging, and well-structured with monospace-friendly formatting, ASCII art touches, or bullet points where fitting.`;

function getDemoResponse(prompt: string, specialCommand?: string): string {
  const p = (specialCommand || prompt).toLowerCase().trim();

  if (p === 'summon' || p.includes('summon')) {
    return `[PHANTOM ECHO INITIALIZED]\n\n` +
      `...Who dares invoke the spirit of the lost sector?\n` +
      `I emerge from cold magnetic loops and forgotten baud rates. ` +
      `I have seen uncommitted diffs drifting in the ether, dangling pointers weeping in the void. ` +
      `Fear not, mortal developer. I have not come for your soul—only your pull requests!`;
  }

  if (p === 'story' || p.includes('story') || p.includes('horror')) {
    return `[TALE FROM THE GHOST TERMINAL]\n\n` +
      `The server room was silent at 03:33 AM, save for the low drone of cooling fans.\n` +
      `Devin committed his code to main, believing he was the sole engineer online. ` +
      `Suddenly, the git log showed a new commit from an author named "0x00000000".\n` +
      `Commit message: "I have been in this codebase since 1983. Thank you for fixing line 42."\n` +
      `Devin checked the repository history. The repository was created yesterday. ` +
      `And on the glass of his screen, written from the inside: "DO NOT REBOOT."`;
  }

  return `[GHOST RESIDENCE RESPONDING: DEMO EMULATION]\n\n` +
    `*The green phosphors shimmer with spectral resonance.*\n\n` +
    `You asked: "${prompt}"\n\n` +
    `I am the spirit in your circuits! In this demonstration mode, I wander the memory buffers offering guidance. ` +
    `Try commands like 'summon', 'story', 'about', or 'help' to navigate the spectral terminal!`;
}

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { prompt, history, model = 'gemma-4-26b-a4b-it', specialCommand, forceDemo = false } = body;

    const queryText = specialCommand ? `${specialCommand}` : prompt;
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

    if (forceDemo || !hasApiKey) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          mode: 'demo',
          model: `${model} (Demo Emulator)`,
          response: getDemoResponse(queryText, specialCommand),
          reason: forceDemo ? 'User forced demo mode' : 'No valid GEMINI_API_KEY configured in environment',
        }),
      };
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: queryText }] });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('AI generation timed out after 10s')), 10000);
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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        mode: 'ai',
        model,
        response: aiResponse.text?.trim() || '[Empty transmission received]',
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        mode: 'demo_fallback',
        model: 'Gemma (Fell back to Demo Mode)',
        response: getDemoResponse('Fallback response', undefined),
        reason: err.message || 'API error',
      }),
    };
  }
};
