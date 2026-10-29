# 👻 GhostTerm AI — "Ghost in the Machine"

> **Hacktoberfest Week 4: "Ghost in the Machine" Project Submission**  
> An interactive retro CRT computer terminal possessed by a friendly, witty, and mysterious open-weight AI ghost.

![GhostTerm AI](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80)

---

## ⚡ Concept

In 1949, philosopher Gilbert Ryle introduced the phrase *"the ghost in the machine"* to critique mind-body dualism. In 2026, neural networks and large language models evoke that same haunting intrigue: emergent wit, knowledge, and reasoning living inside cold silicon circuits.

**GhostTerm AI** resurrects this concept through the aesthetic of a classic 1980s monochrome CRT terminal (VT100). The terminal is possessed by an AI entity that communicates in an atmospheric, cyber-gothic voice while answering real programming and technical queries with sharp accuracy.

---

## 🌟 Features

- **Retro CRT Aesthetic**: Authentic scanlines, CRT screen curvature, phosphor glow, subtle flicker, and blinking cursor (`█`).
- **3 CRT Phosphor Palettes**: Toggle between **P1 Green Phosphor**, **P3 Amber Phosphor**, and **P4 Ice Cyan Phosphor**.
- **Synthesized Retro Audio**: Web Audio API mechanical switch keystroke clicks, 8-bit return bells, and ethereal minor-harmonic ghost chimes (with sound mute toggle).
- **Session Conversation History**: Maintains multi-turn context throughout your session.
- **Terminal Commands**:
  - `help` — Directory of available commands.
  - `summon` — Generates a mysterious spectral invocation.
  - `story` — Spins an eerie short horror / cyber-gothic tale.
  - `about` — Overview of the terminal and system architecture.
  - `why-open-ai` — Read the Open-Weight AI manifesto.
  - `clear` — Wipes the phosphor screen.
  - `status` — Checks server and AI connection health.
  - `model [name]` — Inspects or switches active model architecture.
  - `sound [on/off]` — Toggles acoustic keyboard & chime audio.
  - `theme [green/amber/cyan]` — Switches CRT phosphor color.
  - `glitch` — Triggers an electromagnetic CRT pulse.
- **General Q&A**: Type any natural language question or coding problem and receive a helpful, playful response.
- **Graceful Offline Demo Mode**: If no API key is configured or network calls time out, GhostTerm AI clearly indicates demo emulation rather than pretending to be connected.

---

## 🧠 Why Open-Weight AI?

In the spirit of Hacktoberfest and the open source movement, GhostTerm AI embraces open-weight model architectures like **Google DeepMind's Gemma**:

1. **Transparency & Inspection**: Unlike proprietary black-box APIs, open-weight models let researchers and engineers inspect architecture weights, tokenizer dictionaries, and safety evaluations.
2. **Self-Hosting Independence**: Developers can run Gemma weights on local GPUs using tools like **Ollama**, **llama.cpp**, or **vLLM** without vendor lock-in.
3. **Reproducibility & Longevity**: Software built on open weights remains functional and forkable even if cloud vendors adjust their API offerings.

> *Note on Transparency:* While this hosted preview connects to Google AI Studio endpoints via a secure backend proxy, the codebase is architected so you can effortlessly switch endpoints to a self-hosted local Gemma instance.

### Self-Hosting Gemma with Ollama
To run Gemma weights completely offline on your own machine:
```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull & run Gemma weights
ollama run gemma2:9b

# 3. Point your API endpoint to http://localhost:11434/api/generate
```

---

## 🛡️ Security Architecture

- **Zero Client-Side Secret Leakage**: `GEMINI_API_KEY` is strictly read inside `server.ts` or Netlify Serverless Functions. It is never exposed in browser bundles or client requests.
- **Timeout Protection**: Server-side requests use a 10-second timeout guard to ensure the user never hangs waiting for a frozen network socket.
- **Fail-Safe Demo Emulator**: If the API key is not present or an upstream network glitch occurs, a clearly labeled fallback response is returned with explicit mode annotations (`[DEMO MODE]`).

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/your-username/ghostterm-ai.git
cd ghostterm-ai
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="your-google-ai-studio-api-key"
PORT=3000
```
*(If no API key is provided, the application will automatically run in clearly labeled Demo Mode).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🌐 Deployment Instructions

### Deploying to Netlify
GhostTerm AI comes pre-configured with `netlify.toml` and serverless functions in `netlify/functions/`:

1. Push your repository to **GitHub**.
2. Log into [Netlify](https://www.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Select your GitHub repository.
4. Netlify will automatically detect:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. Under **Site Configuration > Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
6. Click **Deploy Site**.

### Deploying with Docker / Cloud Run
GhostTerm AI includes a full Express server in `server.ts`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📁 Project Architecture

```
├── netlify/
│   └── functions/
│       ├── chat.ts         # Netlify serverless chat handler
│       └── status.ts       # Netlify serverless status endpoint
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx        # Project manual & quick command reference
│   │   ├── Header.tsx            # CRT terminal header & status indicators
│   │   ├── SettingsModal.tsx     # Calibration: models, themes, audio, demo toggle
│   │   ├── TerminalWindow.tsx    # Monospace CRT display & interactive prompt
│   │   └── WhyOpenAiModal.tsx    # Hacktoberfest open-weight AI manifesto
│   ├── types/
│   │   └── terminal.ts           # TypeScript interfaces for messages and models
│   ├── utils/
│   │   ├── audio.ts              # Web Audio API retro acoustic synthesizer
│   │   └── theme.ts              # P1 Green, P3 Amber, and P4 Cyan CRT themes
│   ├── App.tsx                   # Main state & command execution coordinator
│   ├── index.css                 # Scanlines, phosphor glow, CRT flicker styles
│   └── main.tsx                  # React 19 mount point
├── netlify.toml            # Netlify build and redirect configuration
├── package.json            # Scripts and dependencies
├── server.ts               # Express full-stack server with Vite middleware
└── tsconfig.json           # TypeScript configuration
```

---

## 🎃 Hacktoberfest Compliance
- Built for **Hacktoberfest Week 4: "Ghost in the Machine"**.
- Clean, modular TypeScript and React 19 architecture.
- Educational discussion on open-weight models vs proprietary black boxes.
- Zero telemetry, no popups, respectful user privacy.

*Licensed under the Apache 2.0 License.*
